'use strict';

let { queryReportsForAnalysis, queryAllCities } = require("./DataLayer");
let { completeReportsWithUsersData } = require('../utils/reportHelper');

/**
 * Get a list of reports
 * Returns list of reports, optionally filtered by type, city and date.
 *
 * city Integer City location filter to apply (optional)
 * from String From which date filter the content (optional)
 * to String To which date filter the content (optional)
 * type String Type filter to apply (optional)
 * returns inline_response_200_2
 **/
exports.reportsGET = function (city, from, to, type, userType) {
    return new Promise(function (resolve, reject) {
        let restricted = userType === 'citizen';
        queryReportsForAnalysis(from, to, type, city, restricted)
            .then(reports => {
                if (userType === 'citizen') {
                    resolve(reports);
                }
                else {
                    completeReportsWithUsersData(reports)
                        .then(completedReports => resolve(completedReports));
                }
            })
            .catch(err => reject(err))
    });
};

/**
 * Return all cities
 * Return all the cities registered to the system.
 *
 * returns Cities
 **/
exports.citiesGET = function () {
    return new Promise(function (resolve, reject) {
        queryAllCities()
            .then(cities => resolve(cities));
    });
};

