'use strict';

var utils = require('../utils/writer.js');
var ReportVisualization = require('../service/ReportVisualizationService');

module.exports.reportsIdGET = function reportsIdGET (req, res, next) {
  var id = req.swagger.params['id'].value;
  ReportVisualization.reportsIdGET(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.usersReportsGET = function usersReportsGET (req, res, next) {
  ReportVisualization.usersReportsGET()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
