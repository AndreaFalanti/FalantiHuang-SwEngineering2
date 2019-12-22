'use strict';

/**
 * Gets a single user's data
 * Returns logged user non-sensitive data or an error if not authenticated.
 *
 * returns inline_response_200
 **/
exports.usersDataGET = function (id) {
    return new Promise(function (resolve, reject) {
        try {
            return sqlDb("usr")
                .select("email", "firstname", "lastname", "organization_id")
                .where("id", id)
                .first()
                .timeout(2000, {cancel: true})
                .then(user => {
                    if (user) {
                        if(user.organization_id !== null) {
                            return sqlDb("organization")
                                .innerJoin("city", "city.id", "organization.city_id")
                                .select("organization.name", "type", "city.name AS city_name")
                                .where("organization.id", user.organization_id)
                                .first()
                                .timeout(2000, {cancel: true})
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
            return sqlDb("usr")
                .select()
                .where("email", login.email)
                .where("password", login.password)
                .first()
                .timeout(2000, {cancel: true})
                .then(user => {
                    if (user) {
                        resolve(user);
                    } else {
                        reject("Invalid login");
                    }
                });
        } catch (e) {
            reject(e);
        }
    });
};
