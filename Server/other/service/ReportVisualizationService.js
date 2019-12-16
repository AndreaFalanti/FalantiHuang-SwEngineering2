'use strict';


/**
 * Get a single report
 * Returns a report for its id.
 *
 * id Integer 
 * returns inline_response_200_3
 **/
exports.reportsIdGET = function(id) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = "";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Gets citizen own reports list or reports in the same city of authority
 * Returns a list of reports, based on which type of account make the request. A citizen receives reports made by himself, an authority receives reports in its city.
 *
 * returns inline_response_200_1
 **/
exports.usersReportsGET = function() {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = "";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

