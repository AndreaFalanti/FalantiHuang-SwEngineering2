'use strict';

/**
 * Checks if a user with the selected email is already present in the database
 * @param email Email to check
 * @returns {Knex.QueryBuilder<TRecord, TResult>}
 */
let checkIfEmailIsAlreadyTaken = function(email) {
    return sqlDb("usr")
        .first()
        .where("email", email)
        .timeout(2000, {cancel: true})
};

let searchOrganizationWithDomain = function(domain) {
    return sqlDb("organization")
        .first()
        .where("domain", domain)
        .timeout(2000, {cancel: true})
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
            checkIfEmailIsAlreadyTaken(body.email)
                .then(user => {
                    // another user with that email is already existing, so return an error
                    if (user) {
                        reject("Email already taken");
                    }
                    // continue with the registration
                    else {
                        let domain = body.email.split("@")[1];
                        console.log(domain);

                        searchOrganizationWithDomain(domain)
                            .then(organization => {
                                if (organization && organization.type === "authority") {
                                    // add organization_id to the data of registration form
                                    body.organization_id = organization.id;

                                    result = sqlDb("usr")
                                        .insert(body)
                                        .timeout(2000, {cancel: true});

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
            checkIfEmailIsAlreadyTaken(body.email)
                .then(user => {
                    // another user with that email is already existing, so return an error
                    if (user) {
                        reject("Email already taken");
                    }
                    // continue with the registration
                    else {
                        // TODO: check also that the domain of the email provided by the citizen is not present among
                        //  the ones registered for organizations, that should be used only for organization officers (admins and authorities)
                        result = sqlDb("usr")
                            .insert(body)
                            .timeout(2000, {cancel: true});

                        resolve(result);
                    }
                });
        }
        catch (e) {
            console.error(e);
            reject("Server error");
        }
    });
};
