'use strict';

let utils = require('../utils/writer.js');
let OrganizationRegistration = require('../service/OrganizationRegistrationService');

module.exports.adminCitiesRegisterPOST = function adminCitiesRegisterPOST(req, res, next) {
    let body = req.swagger.params['body'].value;

    if (!req.session.loggedin) {
        res.statusCode = 401;
        res.statusMessage = "Not authenticated";
        res.end();
    }
    else if (req.session.account_type !== 'system') {
        res.statusCode = 401;
        res.statusMessage = "Insufficient permissions";
        res.end();
    }
    else {
        OrganizationRegistration.adminCitiesRegisterPOST(body)
            .then(function (response) {
                res.statusCode = 204;
                res.statusMessage = "City successfully registered";
                res.end();
            })
            .catch(function (response) {
                res.statusCode = 400;
                res.statusMessage = "Already registered";
                res.end();
            });
    }
};

module.exports.adminOrganizationsRegisterPOST = function adminOrganizationsRegisterPOST(req, res, next) {
    var body = req.swagger.params['body'].value;

    if (!req.session.loggedin) {
        res.statusCode = 401;
        res.statusMessage = "Not authenticated";
        res.end();
    }
    else if (req.session.account_type !== 'system') {
        res.statusCode = 401;
        res.statusMessage = "Insufficient permissions";
        res.end();
    }
    else {
        OrganizationRegistration.adminOrganizationsRegisterPOST(body)
            .then(function (response) {
                res.statusCode = 204;
                res.statusMessage = "Organization successfully registered";
                res.end();
            })
            .catch(function (response) {
                console.error(response);
                res.statusCode = 400;
                res.statusMessage = "Domain already registered";
                res.end();
            });
    }
};
