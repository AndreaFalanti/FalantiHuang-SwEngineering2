'use strict';

var utils = require('../utils/writer.js');
var OrganizationRegistration = require('../service/OrganizationRegistrationService');

module.exports.adminCitiesGET = function adminCitiesGET(req, res, next) {
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
        OrganizationRegistration.adminCitiesGET()
            .then(function (response) {
                utils.writeJson(res, response);
            })
            .catch(function (response) {
                res.statusCode = 500;
                res.statusMessage = "Server error";
                res.end();
            });
    }
};

module.exports.adminCitiesRegisterPOST = function adminCitiesRegisterPOST(req, res, next) {
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
        OrganizationRegistration.adminCitiesRegisterPOST(body)
            .then(function (response) {
                res.statusCode = 204;
                res.statusMessage = "City successfully registered";
                res.end();
            })
            .catch(function (response) {
                res.statusCode = 500;
                res.statusMessage = "Server error";
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
                res.statusCode = 500;
                res.statusMessage = "Server error";
                res.end();
            });
    }
};
