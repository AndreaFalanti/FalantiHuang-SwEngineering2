'use strict';

var utils = require('../utils/writer.js');
var Login = require('../service/LoginService');

module.exports.usersDataGET = function usersDataGET(req, res, next) {
    if (req.session.loggedin) {
        Login.usersDataGET(req.session.id)
            .then(function (response) {
                utils.writeJson(res, response);
            })
            .catch(function (response) {
                console.log("There is an error with session, this branch shouldn't be taken");
                utils.writeJson(res, response);
            });
    }
    else {
        res.statusCode = 401;
        res.statusMessage = "Not authenticated";
        res.end();
    }
};

module.exports.usersLoginPOST = function usersLoginPOST(req, res, next) {
    var body = req.swagger.params['login'].value;
    Login.usersLoginPOST(body)
        .then(function (response) {
            if (!req.session.loggedin) {
                req.session.loggedin = true;
                req.session.id = response.id;
            }

            res.statusCode = 204;
            res.statusMessage = "Successful login";
            res.end();
        })
        .catch(function (response) {
            res.statusCode = 400;
            res.statusMessage = "Invalid login";
            res.end();
        });
};

/**
 * Logout
 * Logout the user, eliminating the associated session. If the user has no session associated, then he's not logged
 * in and an error is returned.
 *
 * no response value expected for this operation
 **/
module.exports.usersLogoutPOST = function usersLogoutPOST(req, res, next) {
    if(req.session.loggedin) {
        req.session.loggedin = false;
        req.session = null;

        res.statusCode = 204;
        res.statusMessage = "Successful logout";
        res.end();
    }
    else {
        res.statusCode = 400;
        res.statusMessage = "Trying logout when not logged in";
        res.end();
    }
};
