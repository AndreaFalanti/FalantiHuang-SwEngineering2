'use strict';

let SignUp = require('../service/SignUpService');

function performAuthorityRegistration (body, res) {
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

function performCitizenRegistration (body, res) {
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

function performRegistration (body, res, handler) {
    // note the not in front of predicate, because if the email is not satisfying the pattern it's invalid
    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(body.email)) {
        res.statusCode = 400;
        res.statusMessage = "Invalid email";
        res.end();
    }
    else if (body.password.length < 6) {
        res.statusCode = 400;
        res.statusMessage = "Invalid password";
        res.end();
    }
    else if (body.password !== body.confirmPassword) {
        res.statusCode = 400;
        res.statusMessage = "Password mismatch";
        res.end();
    }
    else {
        handler(body, res);
    }
}

module.exports.usersRegisterAuthorityPOST = function usersRegisterAuthorityPOST(req, res, next) {
    performRegistration(req.swagger.params['body'].value, res, performAuthorityRegistration);
};

module.exports.usersRegisterCitizenPOST = function usersRegisterCitizenPOST(req, res, next) {
    performRegistration(req.swagger.params['body'].value, res, performCitizenRegistration);
};
