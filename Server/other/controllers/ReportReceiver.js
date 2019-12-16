'use strict';

var utils = require('../utils/writer.js');
var ReportReceiver = require('../service/ReportReceiverService');

module.exports.reportsPhotoUploadPOST = function reportsPhotoUploadPOST (req, res, next) {
  var body = req.swagger.params['body'].value;
  ReportReceiver.reportsPhotoUploadPOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.reportsSubmitPOST = function reportsSubmitPOST (req, res, next) {
  var body = req.swagger.params['body'].value;
  ReportReceiver.reportsSubmitPOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
