'use strict';

/**
 * Gets a single user's data
 * Returns logged user non-sensitive data or an error if not authenticated.
 *
 * returns inline_response_200
 **/
exports.usersDataGET = function() {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = "";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Login
 * Login into the system.
 *
 * body Login 
 * no response value expected for this operation
 **/
exports.usersLoginPOST = function(login) {
  return new Promise(function(resolve, reject) {
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
    }
    catch (e) {
      reject(e);
    }
  });
};


/**
 * Logout
 * Logout user.
 *
 * no response value expected for this operation
 **/
exports.usersLogoutPOST = function() {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}

