let { queryUserById } = require('../service/DataLayer');

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

module.exports = { completeReportsWithUsersData };