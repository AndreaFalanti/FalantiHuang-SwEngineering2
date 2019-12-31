'use strict';

var utils = require('../utils/writer.js');
var DataAnalysis = require('../service/DataAnalysisService');

module.exports.reportsGET = function reportsGET(req, res, next) {
    var city = req.swagger.params['city'].value;
    var from = req.swagger.params['from'].value;
    var to = req.swagger.params['to'].value;
    var type = req.swagger.params['type'].value;

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
