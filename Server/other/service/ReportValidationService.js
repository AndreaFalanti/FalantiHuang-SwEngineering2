'use strict';

let { updateReportStatus, queryReportById, queryLocationForCityId } = require('./DataLayer');

/**
 * Set a single report status
 * Update the status of a report identified by the given id.
 *
 * body ReportStatus New status to set
 * id Integer
 * no response value expected for this operation
 **/
exports.reportsIdSetStatusPOST = function (body, id, userId, userCityId) {
    return new Promise(async function (resolve, reject) {
        let report = await queryReportById(id);
        if (report) {
            let cityIdObj = await queryLocationForCityId(report.latitude, report.longitude);
            if (cityIdObj.city_id === userCityId) {
                updateReportStatus(id, body.status, userId)
                    .then(() => resolve())
                    .catch(err => {
                        console.error(err);
                        reject({code: 500, message: 'Server error'})
                    });
            }
            else {
                reject({code: 401, message: 'Insufficient permissions'})
            }
        }
        else {
            reject({code: 404, message: 'Report not found (unknown id)'})
        }
    });
};

