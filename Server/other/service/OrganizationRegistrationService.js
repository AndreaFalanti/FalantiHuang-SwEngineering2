'use strict';

let {queryAllCities, insertCityInDb, insertOrganizationInDb} = require("./DataLayer");

/**
 * Return all cities
 * Return all the cities registered to the system.
 *
 * returns Cities
 **/
exports.adminCitiesGET = function () {
    return new Promise(function (resolve, reject) {
        queryAllCities()
            .then(cities => resolve(cities));
    });
};


/**
 * Register a single city
 * Register a city if not present in the database and required to register an organization.
 *
 * body CityData Data of the city to register in the system
 * no response value expected for this operation
 **/
exports.adminCitiesRegisterPOST = function (body) {
    return new Promise(function (resolve, reject) {
        insertCityInDb(body)
            .then(result => resolve(result));
    });
};


/**
 * Register a single organization
 * Register a single organization's data and PEC domain, after an operator had signed a contract with it.
 *
 * body OrganizationData Data of the organization to register in the system
 * no response value expected for this operation
 **/
exports.adminOrganizationsRegisterPOST = function (body) {
    return new Promise(function (resolve, reject) {
        insertOrganizationInDb(body)
            .then(result => resolve(result));
    });
};

