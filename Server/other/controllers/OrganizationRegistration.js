'use strict';

var utils = require('../utils/writer.js');
var OrganizationRegistration = require('../service/OrganizationRegistrationService');

module.exports.adminCitiesGET = function adminCitiesGET (req, res, next) {
  OrganizationRegistration.adminCitiesGET()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.adminCitiesRegisterPOST = function adminCitiesRegisterPOST (req, res, next) {
  var body = req.swagger.params['body'].value;
  OrganizationRegistration.adminCitiesRegisterPOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.adminOrganizationsRegisterPOST = function adminOrganizationsRegisterPOST (req, res, next) {
  var body = req.swagger.params['body'].value;
  OrganizationRegistration.adminOrganizationsRegisterPOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
