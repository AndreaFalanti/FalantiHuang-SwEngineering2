'use strict';

var utils = require('../utils/writer.js');
var SignUp = require('../service/SignUpService');

module.exports.usersRegisterAuthorityPOST = function usersRegisterAuthorityPOST(req, res, next) {
    var body = req.swagger.params['body'].value;
    if (body.password !== body.confirmPassword) {
        res.statusCode = 400;
        res.statusMessage = "Password mismatch";
        res.end();
    }
    else {
        // remove now useless confirmPassword field
        delete body.confirmPassword;

        SignUp.usersRegisterAuthorityPOST(body)
            .then(function (response) {
                res.statusCode = 204;
                res.statusMessage = "Successful registration";
                res.end();
            })
            .catch(function (response) {
                res.statusCode = (response === "Server error") ? 500 : 400;
                res.statusMessage = response;
                res.end();
            });
    }
};

// TODO: refactor code to avoid duplication with case above
module.exports.usersRegisterCitizenPOST = function usersRegisterCitizenPOST(req, res, next) {
    var body = req.swagger.params['body'].value;
    if (body.password !== body.confirmPassword) {
        res.statusCode = 400;
        res.statusMessage = "Password mismatch";
        res.end();
    }
    else {
        // remove now useless confirmPassword field
        delete body.confirmPassword;

        SignUp.usersRegisterCitizenPOST(body)
            .then(function (response) {
                res.statusCode = 204;
                res.statusMessage = "Successful registration";
                res.end();
            })
            .catch(function (response) {
                res.statusCode = (response === "Server error") ? 500 : 400;
                res.statusMessage = response;
                res.end();
            });
    }
};
