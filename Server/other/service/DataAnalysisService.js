'use strict';


/**
 * Get a list of reports
 * Returns list of reports, optionally filtered by type, city and date.
 *
 * city Integer City location filter to apply
 * from String From which date filter the content (optional)
 * to String To which date filter the content (optional)
 * type String Type filter to apply (optional)
 * returns inline_response_200_2
 **/
exports.reportsGET = function(city,from,to,type) {
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

