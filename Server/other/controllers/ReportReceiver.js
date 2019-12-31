'use strict';

var utils = require('../utils/writer.js');
var ReportReceiver = require('../service/ReportReceiverService');
const fs = require('fs');

function removePhotos (photos) {
    photos.forEach((p, i) => fs.unlink(p.path, () => console.log("Removed tmp photo " + i)))
}

module.exports.reportsPhotoUploadPOST = function reportsPhotoUploadPOST(req, res, next) {
    var body = req.swagger.params['photo'].value;
    let photo = body.photo[0];

    if (!req.session.loggedin) {
        fs.unlink(photo.path, () => console.log('Temporary photo eliminated'));
        res.statusCode = 401;
        res.statusMessage = "Not authenticated";
        res.end();
    }
    else if (req.session.account_type !== 'citizen') {
        fs.unlink(photo.path, () => console.log('Temporary photo eliminated'));
        res.statusCode = 401;
        res.statusMessage = "Insufficient permissions";
        res.end();
    }
    else {
        // add .jpg extension to photo (not necessary but useful for testing)
        fs.rename(photo.path, photo.path + '.jpg', err => {
            if(err){
                res.statusCode = 400;
                res.statusMessage = "Invalid upload";
                res.end();
            }
            else{
                console.log("File OK");
                ReportReceiver.reportsPhotoUploadPOST(photo)
                    .then(function (response) {
                        utils.writeJson(res, response);
                    })
                    .catch(function (response) {
                        res.statusCode = response.code;
                        res.statusMessage = response.message;
                        res.end();
                    });
            }
        });
    }
};

module.exports.reportsSubmitPOST = function reportsSubmitPOST(req, res, next) {
    let body = req.swagger.params['report'].value;

    if (!req.session.loggedin) {
        removePhotos(body.photo_files);
        res.statusCode = 401;
        res.statusMessage = "Not authenticated";
        res.end();
    }
    else if (req.session.account_type !== 'citizen') {
        removePhotos(body.photo_files);
        res.statusCode = 401;
        res.statusMessage = "Insufficient permissions";
        res.end();
    }
    else {
        body.timestamp = new Date(Date.now()).toLocaleString();
        body.report_status = 'pending';
        body.submitter_id = req.session.id;

        //console.log(JSON.stringify(body));
        //res.status(200).end();
        ReportReceiver.reportsSubmitPOST(body)
            .then(function (response) {
                res.statusCode = 204;
                res.statusMessage = 'Report processed successfully';
                res.end();
            })
            .catch(function (response) {
                console.error(response)
                res.statusCode = 500;
                res.statusMessage = 'Server error';
                res.end();
            })
            .finally(() => removePhotos(body.photo_files));
    }
};
