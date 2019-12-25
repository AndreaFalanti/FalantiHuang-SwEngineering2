'use strict';

let {queryUserByEmail,queryOrganizationByDomain, insertUserInDb} = require("./DataLayer");

/**
 * Register
 * Authority registration into SafeStreets system.
 *
 * body Authority_registration_data Data inserted by the authority in the registration form
 * no response value expected for this operation
 **/
exports.usersRegisterAuthorityPOST = function(body) {
    return new Promise(function(resolve, reject) {
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

                                    insertUserInDb(body)
                                        .then(result => resolve(result));
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
                                    insertUserInDb(body)
                                        .then(result => resolve(result));
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
