'use strict';

var utils = require('../utils/writer.js');
var SignUp = require('../service/SignUpService');

module.exports.usersRegisterAuthorityPOST = function usersRegisterAuthorityPOST (req, res, next) {
  var body = req.swagger.params['body'].value;
  SignUp.usersRegisterAuthorityPOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.usersRegisterCitizenPOST = function usersRegisterCitizenPOST (req, res, next) {
  var body = req.swagger.params['body'].value;
  SignUp.usersRegisterCitizenPOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
