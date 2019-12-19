'use strict';

/**
 * Checks if a user with the selected email is already present in the database
 * @param email Email to check
 */
let checkIfEmailIsAlreadyTaken = function(email) {
    return sqlDb("usr")
        .first()
        .where("email", email)
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
                        reject();
                    }
                    // continue with the registration
                    else {
                        result = sqlDb("usr")
                            .insert(body)
                            .timeout(2000, {cancel: true});

                        resolve(result);
                    }
                });
        }
        catch (e) {
            reject(e);
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
                        reject();
                    }
                    // continue with the registration
                    else {
                        result = sqlDb("usr")
                            .insert(body)
                            .timeout(2000, {cancel: true});

                        resolve(result);
                    }
                });
        }
        catch (e) {
            reject(e);
        }
    });
};

