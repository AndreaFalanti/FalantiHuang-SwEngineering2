'use strict';

const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');
const {insertReportInDb, queryCurrValOfIdSequence} = require("./DataLayer");

const OCR_API_key = "85a286ccaae965db66624f6eb603660e87bfc7e9";

/**
 * Upload first photo of a report
 * Upload first photo of a violation report, so that the license plate of the vehicle can be recognised.
 *
 * photo Object First photo of the report
 * returns String
 **/
exports.reportsPhotoUploadPOST = function (photo) {
    let image_path = photo.path + '.jpg';
    let OCR_body = new FormData();
    OCR_body.append('upload', fs.createReadStream(image_path));
    //OCR_body.append('regions', 'it');
    return new Promise(function (resolve, reject) {
        console.log("performing request to OCR service");

        let options = {
            method: 'POST',
            body: OCR_body,
            headers: {
                "Authorization": "Token 85a286ccaae965db66624f6eb603660e87bfc7e9"
            },
            timeout: 0
        };

        fetch("https://api.platerecognizer.com/v1/plate-reader/", options)
            .then(res => res.json())
            .then(json => {
                console.log(json);
                resolve(json.results[0].plate);
            })
            .catch((err) => {
                reject(err);
            })
            .finally(() => fs.unlink(photo.path + '.jpg', () => {
                console.log("Temporary image eliminated")
                })
            )
    });
};


/**
 * Upload report form data
 * Receive report form compiled from a citizen.
 *
 * body ReportForm Report form data
 * no response value expected for this operation
 **/
exports.reportsSubmitPOST = function (body) {
    return new Promise(function (resolve, reject) {
        //TODO: choose service for geocoding and add city, place and location (if not present) in the db, then
        // procede with the report insertion in the database

        insertReportInDb(body)
            .then(() => {
                queryCurrValOfIdSequence('report')
                    .then(value => {
                        console.log(value);
                        //TODO: put photos in folder named after report id and add the paths to the db tuple with an update
                        resolve();
                    });
            });
    });
};

