'use strict';

var utils = require('../utils/writer.js');
var ReportReceiver = require('../service/ReportReceiverService');
const fs = require('fs');

module.exports.reportsPhotoUploadPOST = function reportsPhotoUploadPOST(req, res, next) {
    var body = req.swagger.params['photo'].value;
    let photo = body.photo[0];
    //body.photo[0].pipe(fs.createWriteStream('image.jpg'));

    // save photo as a test that is received correctly
    fs.rename(photo.path, 'image.jpg', err => {
        if(err){
            console.log("Something wrong");
            res.status(400).send("Invalid upload");
        }
        else{
            console.log("File OK");
            ReportReceiver.reportsPhotoUploadPOST(photo)
                .then(function (response) {
                    utils.writeJson(res, response);
                })
                .catch(function (response) {
                    utils.writeJson(res, response);
                });
        }
    });
};

module.exports.reportsSubmitPOST = function reportsSubmitPOST(req, res, next) {
    var body = req.swagger.params['body'].value;
    ReportReceiver.reportsSubmitPOST(body)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};
