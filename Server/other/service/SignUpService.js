'use strict';

/**
 * Generate the query for getting the user with the given email
 * @param email Email to check
 * @returns Knex promise with the query
 */
let queryUserByEmail = function(email) {
    return sqlDb("usr")
        .first()
        .where("email", email)
        .timeout(2000, {cancel: true})
};

/**
 * Generate the query for getting the organization with the given domain
 * @param domain Domain to search
 * @returns Knex promise with the query
 */
let queryOrganizationByDomain = function(domain) {
    return sqlDb("organization")
        .first()
        .where("domain", domain)
        .timeout(2000, {cancel: true})
};

/**
 * Insert a user into the database
 * @param user User data to insert
 */
let insertUserInDb = function(user) {
    sqlDb("usr")
        .insert(user)
        .timeout(2000, {cancel: true});
};

/**
 * Register
 * Authority registration into SafeStreets system.
 *
 * body Authority_registration_data Data inserted by the authority in the registration form
 * no response value expected for this operation
 **/
exports.usersRegisterAuthorityPOST = function(body) {
    return new Promise(function(resolve, reject) {
        let result;
        try {
            queryUserByEmail(body.email)
                .then(user => {
                    // another user with that email is already existing, so return an error
                    if (user) {
                        reject("Email already taken");
                    }
                    // continue with the registration
                    else {
                        let domain = body.email.split("@")[1];

                        queryOrganizationByDomain(domain)
                            .then(organization => {
                                if (organization && organization.type === "authority") {
                                    // add organization_id to the data of registration form
                                    body.organization_id = organization.id;

                                    result = insertUserInDb(body);
                                    resolve(result);
                                }
                                else {
                                    reject("Invalid domain")
                                }
                            });
                    }
                });
        }
        catch (e) {
            console.error(e);
            reject("Server error");
        }
    });
};


/**
 * Register
 * Citizen registration into SafeStreets system.
 *
 * body Citizen_registration_data Data inserted by the citizen in the registration form
 * no response value expected for this operation
 **/
exports.usersRegisterCitizenPOST = function(body) {
    return new Promise(function(resolve, reject) {
        let result;
        try {
            queryUserByEmail(body.email)
                .then(user => {
                    // another user with that email is already existing, so return an error
                    if (user) {
                        reject("Email already taken");
                    }
                    // continue with the registration
                    else {
                        let domain = body.email.split("@")[1];

                        queryOrganizationByDomain(domain)
                            .then(organization => {
                                // an organization with that domain is present, therefore is not a valid citizen account
                                if (organization) {
                                    reject("Registering as citizen with an organization domain");
                                }
                                else {
                                    result = insertUserInDb(body);
                                    resolve(result);
                                }
                            });
                    }
                });
        }
        catch (e) {
            console.error(e);
            reject("Server error");
        }
    });
};
