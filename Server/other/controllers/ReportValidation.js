'use strict';

let utils = require('../utils/writer.js');
let ReportValidation = require('../service/ReportValidationService');

module.exports.reportsIdSetStatusPOST = function reportsIdSetStatusPOST(req, res, next) {
    let body = req.swagger.params['status'].value;
    let id = req.swagger.params['id'].value;

    if (!req.session.loggedin) {
        res.statusCode = 401;
        res.statusMessage = "Not authenticated";
        res.end();
    }
    else if (req.session.account_type !== 'authority') {
        res.statusCode = 401;
        res.statusMessage = "Insufficient permissions";
        res.end();
    }
    else {
        let userId = req.session.id;
        let userCityId = req.session.city_id;
        ReportValidation.reportsIdSetStatusPOST(body, id, userId, userCityId)
            .then(function (response) {
                utils.writeJson(res, response);
            })
            .catch(function (response) {
                res.statusCode = response.code;
                res.statusMessage = response.message;
                res.end();
            });
    }
};
