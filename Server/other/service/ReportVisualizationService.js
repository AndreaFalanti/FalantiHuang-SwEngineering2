'use strict';

let { queryReportsBySubmitterId, queryReportsByCityId, queryUserById, queryReportById,
    queryLocationForCityId } = require("./DataLayer");

/**
 * Add submitter and supervisor objects to each report of the given array
 * @param reports Array of reports
 * @returns Promise that returns the updated array of reports
 */
function completeReportsWithUsersData (reports) {
    return new Promise((resolve, reject) => {
        let results = [];
        reports.forEach(async report => {
            let submitterData = await queryUserById(report.submitter_id);
            let supervisorData = null;
            if (report.supervisor_id !== null) {
                supervisorData = await queryUserById(report.supervisor_id);
                delete supervisorData.organization_id;
            }

            delete submitterData.organization_id;
            report.submitter = submitterData;
            report.supervisor = supervisorData;

            results.push(report);
            if (results.length === reports.length) {
                resolve(results);
            }
        })
    })
}

/**
 * Get a single report
 * Returns a report for its id.
 *
 * id Integer
 * returns inline_response_200_3
 **/
exports.reportsIdGET = function (id, user_id, user_type, user_city_id) {
    return new Promise(function (resolve, reject) {
        queryReportById(id)
            .then(report => {
                if (user_type === 'citizen') {
                    if (report.submitter_id === user_id) {
                        resolve(report);
                    }
                    else {
                        reject();
                    }
                }
                else {
                    queryLocationForCityId(report.latitude, report.longitude)
                        .then(obj => {
                            if(obj.city_id === user_city_id) {
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
                        .then(reports => resolve(reports))
                        .catch(err => reject(err))
                })
        }
    });
};

