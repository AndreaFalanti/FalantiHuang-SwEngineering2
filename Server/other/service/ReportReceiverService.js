'use strict';

const url = require('url');
const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const {insertReportInDb,queryCityByNameAndRegion ,insertCityInDb, insertPlaceInDb, insertLocationInDb,
    updateReportWithPhotoPaths, queryPlaceByCityAndAddress, queryLocationByLatAndLon} = require("./DataLayer");

const OCR_API_KEY = "85a286ccaae965db66624f6eb603660e87bfc7e9";

/**
 * Generate the url for reverse geocoding, setting up the query parameters
 * @param latitude Latitude of the location
 * @param longitude Longitude of the location
 * @returns String containing URL used for reverse geocoding the location
 */
function generateReverseGeocodingUrl (latitude, longitude) {
    return url.format({
        protocol: 'https',
        hostname: 'nominatim.openstreetmap.org',
        pathname: '/reverse',
        query: {
            lat: latitude,
            lon: longitude,
            zoom: 17,               //streets
            format: 'jsonv2'
        }
    });
}

/**
 * Generate city data for db insertion
 * @param name City's name
 * @param region City's region
 * @returns {{name: *, region: *}}
 */
function generateCityData(name, region) {
    return {
        name: name,
        region: region
    };
}

/**
 * Generate place data for db insertion
 * @param address Place's address
 * @param city_id Id of city where place is located
 * @returns {{address: *, city_id: *}}
 */
function generatePlaceData(address, city_id) {
    return {
        address: address,
        city_id: city_id
    };
}

/**
 * Generate location data for db insertion
 * @param report Report form
 * @param place_id Id of the place where location is placed
 * @returns {{latitude: number, place_id: *, longitude: number}}
 */
function generateLocationData(report, place_id) {
    return {
        latitude: report.latitude,
        longitude: report.longitude,
        place_id: place_id
    };
}

/**
 * Create a folder for report photos and same them there
 * @param photos Photos to save
 * @param report_id Report's id
 * @returns Promise with the operation
 */
function savePhotos (photos, report_id) {
    return new Promise(((resolve, reject) => {
        let photo_paths = [];
        let folderPath = path.join(process.cwd(), 'public', 'reports', report_id.toString());

        fs.mkdir(folderPath, folderErr => {
            if (folderErr && folderErr.code !== 'EEXIST') {
                reject(folderErr);
            }

            for (let photo of photos) {
                let newPath = path.join(folderPath, photo.filename + '.jpg');
                fs.rename(photo.path, newPath, err => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        // take only the path after public folder (without slash or backslash)
                        let splitPath = newPath.split("public")[1].slice(1);
                        photo_paths.push(splitPath);
                        // all photos have been processed
                        if (photo_paths.length === photos.length) {
                            resolve(photo_paths);
                        }
                    }
                });
            }
        });
    }))
}

/**
 * Insert in db the report data and update it with the saved photos
 * @param body Report form
 * @returns Promise with the operation
 */
function finalizeReportInsertion (body) {
    return new Promise((async (resolve, reject) => {
        let bodyDeepCopy = JSON.parse(JSON.stringify(body));
        delete bodyDeepCopy.photo_files;

        let report_id = await insertReportInDb(bodyDeepCopy);

        let photo_paths = await savePhotos(body.photo_files, report_id[0]);
        // reject if there was an error in photos saving
        if (photo_paths === null) {
            console.log("error while saving photos");
            reject();
        }

        await updateReportWithPhotoPaths(report_id[0], photo_paths);
        resolve();
    }))
}

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
                "Authorization": "Token " + OCR_API_KEY
            },
            timeout: 0
        };

        fetch("https://api.platerecognizer.com/v1/plate-reader/", options)
            .then(res => res.json())
            .then(json => {
                console.log(json);
                // no results from OCR, invalid photo or OCR fault? Let the user choose the license plate
                if (json.results.length === 0) {
                    reject({code: 400, message: 'License plate not recognised'})
                }
                else {
                    resolve({"license_plate": json.results[0].plate.toUpperCase()});
                }
            })
            .catch((err) => {
                reject({code: 500, message: 'OCR service is offline'});
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
        let geocodingURL = generateReverseGeocodingUrl(body.latitude, body.longitude);
        console.log(geocodingURL);

        fetch(geocodingURL, {method: 'GET'})
            .then(res => res.json())
            .then(async json => {
                console.log(json);

                if(json.address.country_code !== "it") {
                    reject({code: 400, message: "Country not supported"})
                }
                else if(!json.address.road) {
                    reject({code: 400, message: "Unknown address"})
                }
                else {
                    //check if the city is already present in the db
                    let city = await queryCityByNameAndRegion(json.address.city, json.address.state);
                    //not present
                    if (!city) {
                        let cityData = generateCityData(json.address.city, json.address.state);

                        // if city wasn't in db, then also place can't be present
                        let city_id = await insertCityInDb(cityData);
                        let placeData = generatePlaceData(json.address.road, city_id[0]);

                        // if place wasn't in db, then also the location can't be present
                        let place_id = await insertPlaceInDb(placeData);
                        let locationData = generateLocationData(body, place_id[0]);

                        await insertLocationInDb(locationData);

                        await finalizeReportInsertion(body);
                        resolve();
                    }
                    else {
                        let place = await queryPlaceByCityAndAddress(city.id, json.address.road);

                        if (!place) {
                            let placeData = generatePlaceData(json.address.road, city.id);

                            // if place wasn't in db, then also the location can't be present
                            let place_id = await insertPlaceInDb(placeData);
                            let locationData = generateLocationData(body, place_id[0]);

                            await insertLocationInDb(locationData);

                            await finalizeReportInsertion(body);
                            resolve();
                        }
                        else {
                            let location = await queryLocationByLatAndLon(body.latitude, body.longitude);

                            if(!location) {
                                let locationData = generateLocationData(body, place.id);

                                await insertLocationInDb(locationData);

                                await finalizeReportInsertion(body);
                                resolve();
                            }
                            else {
                                await finalizeReportInsertion(body);
                                resolve();
                            }
                        }
                    }
                }
            })
            .catch((err) => {
                console.error(err);
                reject({code: 500, message: "server error"});
            });
    });
};

