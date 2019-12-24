'use strict';

/**
 * Generate the query for getting a user without sensitive data, given its id.
 * @param id User id to search
 * @returns Knex promise with the query
 */
function queryUserById(id) {
    return sqlDb("usr")
        .select("email", "firstname", "lastname", "organization_id")
        .where("id", id)
        .first()
        .timeout(2000, {cancel: true})
}

/**
 * Generate the query for getting useful data of an organization, given its id.
 * @param id Organization id to search
 * @returns Knex promise with the query
 */
function queryOrganizationById(id) {
    return sqlDb("organization")
        .innerJoin("city", "city.id", "organization.city_id")
        .select("organization.name", "type", "city.name AS city_name")
        .where("organization.id", user.organization_id)
        .first()
        .timeout(2000, {cancel: true})
}

/**
 * Generate query for getting a user from the database, that matches the login credentials.
 * @param password Password inserted in login form
 * @param email Email inserted in login form
 * @returns Knex promise with the query
 */
function queryUserByPasswordAndEmail (password, email) {
    return sqlDb("usr")
        .select()
        .where("email", email)
        .where("password", password)
        .first()
        .timeout(2000, {cancel: true})
}

function queryOrganizationByIdForItsType(id) {
    return sqlDb("organization")
        .select("type")
        .where("id", id)
        .first()
        .timeout(2000, {cancel: true})
}

/**
 * Gets a single user's data
 * Returns logged user non-sensitive data or an error if not authenticated.
 *
 * returns inline_response_200
 **/
exports.usersDataGET = function (id) {
    return new Promise(function (resolve, reject) {
        try {
            queryUserById(id)
                .then(user => {
                    if (user) {
                        if(user.organization_id !== null) {
                            queryOrganizationById(user.organization_id)
                                .then(orgData => {
                                    // add fields regarding the organization to accounts that have one
                                    console.log(JSON.stringify(orgData));
                                    user.org_name = orgData.name;
                                    user.org_city = orgData.city_name;
                                    user.org_type = orgData.type;

                                    delete user.organization_id;
                                    resolve(user);
                                });
                        }
                        else {
                            delete user.organization_id;
                            resolve(user);
                        }
                    } else {
                        reject("User not found");
                    }
                });
        } catch (e) {
            reject(e);
        }
    });
};


/**
 * Login
 * Login into the system.
 *
 * body Login
 * no response value expected for this operation
 **/
exports.usersLoginPOST = function (login) {
    return new Promise(function (resolve, reject) {
        try {
           queryUserByPasswordAndEmail(login.password, login.email)
                .then(user => {
                    if (user) {
                        if (user.organization_id !== null) {
                            return queryOrganizationByIdForItsType(user.organization_id)
                                .then(organization => {
                                    user.account_type = organization.type;
                                    resolve(user);
                                });
                        }
                        else {
                            user.account_type = "citizen";
                            resolve(user);
                        }
                    } else {
                        reject("Invalid login");
                    }
                });
        } catch (e) {
            reject(e);
        }
    });
};
