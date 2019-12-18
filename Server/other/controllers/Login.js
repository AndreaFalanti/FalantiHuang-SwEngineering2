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
  var body = req.swagger.params['login'].value;
  Login.usersLoginPOST(body)
      .then(function (response) {
        if(!req.session.loggedin) {
          req.session.loggedin = true;
          req.session.id = response.id;
        }

        res.statusCode = 204;
        res.statusMessage = "Successful login";
        res.end();
      })
      .catch(function (response) {
        console.log("lol");
        res.statusCode = 400;
        res.statusMessage = "Invalid login";
        res.end();
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
