'use strict';

let {queryUserById, queryOrganizationByIdForUserProfile, queryUserByPasswordAndEmail, queryOrganizationById} = require("./DataLayer");

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
                            queryOrganizationByIdForUserProfile(user.organization_id)
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
                            return queryOrganizationById(user.organization_id)
                                .then(organization => {
                                    user.account_type = organization.type;
                                    user.city_id = organization.city_id;
                                    resolve(user);
                                });
                        }
                        else {
                            user.account_type = "citizen";
                            user.city_id = null;
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
