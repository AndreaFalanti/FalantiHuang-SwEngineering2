'use strict';

const url = require('url');
const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');
const {insertReportInDb, queryCurrValOfIdSequence ,queryCityByNameAndRegion ,insertCityInDb, insertPlaceInDb,
    insertLocationInDb} = require("./DataLayer");

const OCR_API_KEY = "85a286ccaae965db66624f6eb603660e87bfc7e9";
/* GEOCODING provided by Google Maps, unusable because i can't register the billing with my prepaid card
    and i don't have a credit card because i'm poor :(
const GEOCODING_API_KEY = "AIzaSyDvpnWg_uKaAdhrdsfP3om11wkp0hGhTjc";
const GEOCODE_URI = "https://maps.googleapis.com/maps/api/geocode/json";
let geocodingURL = url.format({
    protocol: 'https',
    hostname: 'maps.googleapis.com',
    pathname: '/maps/api/geocode/json',
    query: {
        latlng: `${body.latitude},${body.longitude}`,
        key: GEOCODING_API_KEY
    }
});*/

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
        let geocodingURL = url.format({
            protocol: 'https',
            hostname: 'nominatim.openstreetmap.org',
            pathname: '/reverse',
            query: {
                lat: body.latitude,
                lon: body.longitude,
                zoom: 17,               //streets
                format: 'jsonv2'
            }
        });
        console.log(geocodingURL);

        fetch(geocodingURL, {method: 'GET'})
            .then(res => res.json())
            .then(json => {
                console.log(json);

                //check if the city is already present in the db
                queryCityByNameAndRegion(json.address.city, json.address.state)
                    .then(city => {
                        //not present
                        if (!city) {
                            let cityData = {
                                name: json.address.city,
                                region: json.address.state
                            };

                            insertCityInDb(cityData)
                                .then(city_id => {
                                    // if city wasn't in db, then also place can't be present
                                    let placeData = {
                                        address: json.address.road,
                                        city_id: city_id[0]
                                    };

                                    insertPlaceInDb(placeData)
                                        .then(place_id => {
                                            // if place wasn't in db, then also the location can't be present
                                            let locationData = {
                                                latitude: body.latitude,
                                                longitude: body.longitude,
                                                place_id: place_id[0]
                                            };

                                            insertLocationInDb(locationData)
                                                .then(() => {
                                                    let photos = body.photo_files;
                                                    delete body.photo_files;

                                                    insertReportInDb(body)
                                                        .then(report_id => {
                                                            //TODO: put photos in folder named after report id and add the paths to the db tuple with an update
                                                            resolve();
                                                        });
                                                })
                                        })
                                })
                        }
                        else {
                            console.log("wrong resolve");
                            resolve();
                        }
                    });
                resolve();
            })
            .catch((err) => {
                reject(err);
            });
    });
};

