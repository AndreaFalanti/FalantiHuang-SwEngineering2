'use strict';

let utils = require('../utils/writer.js');
let DataAnalysis = require('../service/DataAnalysisService');

module.exports.reportsGET = function reportsGET(req, res, next) {
    let city = req.swagger.params['city'].value;
    let from = req.swagger.params['from'].value;
    let to = req.swagger.params['to'].value;
    let type = req.swagger.params['type'].value;

    if (from) {
        from = new Date(from);
    }
    if (to) {
        to = new Date(to);
    }

    if (!req.session.loggedin) {
        res.statusCode = 401;
        res.statusMessage = "Not authenticated";
        res.end();
    }
    else {
        let userType = req.session.account_type;
        DataAnalysis.reportsGET(city, from, to, type, userType)
            .then(function (response) {
                utils.writeJson(res, response);
            })
            .catch(function (response) {
                console.error(response);
                res.statusCode = 500;
                res.statusMessage = "Server error";
                res.end();
            });
    }
};
