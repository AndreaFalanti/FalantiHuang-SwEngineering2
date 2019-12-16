'use strict';

var utils = require('../utils/writer.js');
var Login = require('../service/LoginService');

module.exports.usersDataGET = function usersDataGET (req, res, next) {
  Login.usersDataGET()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.usersLoginPOST = function usersLoginPOST (req, res, next) {
  var body = req.swagger.params['body'].value;
  Login.usersLoginPOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.usersLogoutPOST = function usersLogoutPOST (req, res, next) {
  Login.usersLogoutPOST()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
