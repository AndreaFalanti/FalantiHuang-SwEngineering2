'use strict';

let SignUp = require('../service/SignUpService');

module.exports.usersRegisterAuthorityPOST = function usersRegisterAuthorityPOST(req, res, next) {
    let body = req.swagger.params['body'].value;

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
                res.statusCode = response.code;
                res.statusMessage = response.message;
                res.end();
            });
    }
};

module.exports.usersRegisterCitizenPOST = function usersRegisterCitizenPOST(req, res, next) {
    let body = req.swagger.params['body'].value;

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
