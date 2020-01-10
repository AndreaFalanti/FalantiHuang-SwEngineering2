'use strict';

let { queryReportsBySubmitterId, queryReportsByCityId, queryReportById, queryLocationForCityId } = require("./DataLayer");

let { completeReportsWithUsersData } = require('../utils/reportHelper');

/**
 * Get a single report
 * Returns a report for its id.
 *
 * id Integer
 * returns inline_response_200_3
 **/
exports.reportsIdGET = function (id, userId, userType, userCityId) {
    return new Promise(function (resolve, reject) {
        queryReportById(id)
            .then(report => {
                if (userType === 'citizen') {
                    if (report.submitter_id === userId) {
                        delete report.submitter_id;
                        delete report.supervisor_id;
                        resolve(report);
                    }
                    else {
                        reject();
                    }
                }
                else {
                    queryLocationForCityId(report.latitude, report.longitude)
                        .then(obj => {
                            if(obj.city_id === userCityId) {
                                resolve(report);
                            }
                            else {
                                reject();
                            }
                        })
                }
            })
    });
};


/**
 * Gets citizen own reports list or reports in the same city of authority
 * Returns a list of reports, based on which type of account make the request. A citizen receives reports made by himself, an authority receives reports in its city.
 *
 * returns inline_response_200_1
 **/
exports.usersReportsGET = function (userId, userType, userCityId) {
    return new Promise(function (resolve, reject) {
        if (userType === 'citizen') {
            queryReportsBySubmitterId(userId)
                .then(reports => resolve(reports))
                .catch(err => reject(err))
        }
        else {
            queryReportsByCityId(userCityId)
                .then(reports => {
                    completeReportsWithUsersData(reports)
                        .then(completedReports => resolve(completedReports))
                        .catch(err => reject(err))
                })
        }
    });
};

