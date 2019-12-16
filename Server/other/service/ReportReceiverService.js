'use strict';


/**
 * Upload first photo of a report
 * Upload first photo of a violation report, so that the license plate of the vehicle can be recognised.
 *
 * body Object First photo of the report
 * returns String
 **/
exports.reportsPhotoUploadPOST = function(body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = "AA000AA";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Upload report form data
 * Receive report form compiled from a citizen.
 *
 * body ReportForm Report form data
 * no response value expected for this operation
 **/
exports.reportsSubmitPOST = function(body) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}

