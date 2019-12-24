'use strict';

/**
 * Generate the query for getting all the cities registered to the system
 * @returns Knex promise with the query
 */
let queryAllCities = function () {
    return sqlDb("city")
        .select()
        .timeout(2000, {cancel: true})
};

/**
 * Insert city into the database
 * @param city City data to insert
 */
let insertCityInDb = function(city) {
    sqlDb("city")
        .insert(city)
        .timeout(2000, {cancel: true});
};

/**
 * Insert organization into the database
 * @param organization Organization data to insert
 */
let insertOrganizationInDb = function(organization) {
    sqlDb("organization")
        .insert(organization)
        .timeout(2000, {cancel: true});
};

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
        let result = insertCityInDb(body);
        resolve(result);
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
        let result = insertOrganizationInDb(body);
        resolve(result);
    });
};

