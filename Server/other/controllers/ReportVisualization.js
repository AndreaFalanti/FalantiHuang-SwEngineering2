'use strict';

var utils = require('../utils/writer.js');
var ReportVisualization = require('../service/ReportVisualizationService');

module.exports.reportsIdGET = function reportsIdGET(req, res, next) {
    var id = req.swagger.params['id'].value;

    if (!req.session.loggedin) {
        res.statusCode = 401;
        res.statusMessage = "Not authenticated";
        res.end();
    }
    else {
        let user_id = req.session.id;
        let user_type = req.session.account_type;
        let user_city_id = req.session.city_id;
        ReportVisualization.reportsIdGET(id, user_id, user_type, user_city_id)
            .then(function (response) {
                utils.writeJson(res, response);
            })
            .catch(function (response) {
                res.statusCode = 401;
                res.statusMessage = "Insufficient permissions";
                res.end();
            });
    }
};

module.exports.usersReportsGET = function usersReportsGET(req, res, next) {
    if (!req.session.loggedin) {
        res.statusCode = 401;
        res.statusMessage = "Not authenticated";
        res.end();
    }
    else {
        let userId = req.session.id;
        let userType = req.session.account_type;
        let userCityId = req.session.city_id;
        ReportVisualization.usersReportsGET(userId, userType, userCityId)
            .then(function (response) {
                utils.writeJson(res, response);
            })
            .catch(function (response) {
                res.statusCode = 500;
                res.statusMessage = "Server error";
                res.end();
            });
    }
};
