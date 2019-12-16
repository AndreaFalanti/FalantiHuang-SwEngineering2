'use strict';

var utils = require('../utils/writer.js');
var ReportValidation = require('../service/ReportValidationService');

module.exports.reportsIdSetStatusPOST = function reportsIdSetStatusPOST (req, res, next) {
  var body = req.swagger.params['body'].value;
  var id = req.swagger.params['id'].value;
  ReportValidation.reportsIdSetStatusPOST(body,id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
