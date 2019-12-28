const knex = require("knex");
let knexConfig = require("../../knexfile");
require('dotenv').config();

let sqlDb = knex(knexConfig[process.env.NODE_ENV]);
global.sqlDb = sqlDb;

//function used to setup all database tables required
exports.setupDataLayer = async function () {
    if (process.env.NODE_ENV === 'development') {
        console.log("Setting up data layer...");
        await sqlDb.migrate.latest();
        //await sqlDb.seed.run();
    }
};

/**
 * Generate the query for getting a user without sensitive data, given its id.
 * @param id User id to search
 * @returns Knex promise with the query
 */
exports.queryUserById = function (id) {
    return sqlDb("usr")
        .select("email", "firstname", "lastname", "organization_id")
        .where("id", id)
        .first()
        .timeout(2000, {cancel: true})
};

/**
 * Generate the query for getting useful data of an organization, given its id.
 * @param id Organization id to search
 * @returns Knex promise with the query
 */
exports.queryOrganizationByIdForUserProfile = function (id) {
    return sqlDb("organization")
        .innerJoin("city", "city.id", "organization.city_id")
        .select("organization.name", "type", "city.name AS city_name")
        .where("organization.id", id)
        .first()
        .timeout(2000, {cancel: true})
};

/**
 * Generate query for getting a user from the database, that matches the login credentials.
 * @param password Password inserted in login form
 * @param email Email inserted in login form
 * @returns Knex promise with the query
 */
exports.queryUserByPasswordAndEmail = function (password, email) {
    return sqlDb("usr")
        .select()
        .where("email", email)
        .where("password", password)
        .first()
        .timeout(2000, {cancel: true})
};

/**
 * Generate the query for getting type of an organization, given its id.
 * @param id Organization id to search
 * @returns Knex promise with the query
 */
exports.queryOrganizationByIdForItsType = function (id) {
    return sqlDb("organization")
        .select("type")
        .where("id", id)
        .first()
        .timeout(2000, {cancel: true})
};

/**
 * Generate the query for getting the user with the given email
 * @param email Email to check
 * @returns Knex promise with the query
 */
exports.queryUserByEmail = function(email) {
    return sqlDb("usr")
        .first()
        .where("email", email)
        .timeout(2000, {cancel: true})
};

/**
 * Generate the query for getting the organization with the given domain
 * @param domain Domain to search
 * @returns Knex promise with the query
 */
exports.queryOrganizationByDomain = function(domain) {
    return sqlDb("organization")
        .first()
        .where("domain", domain)
        .timeout(2000, {cancel: true})
};

/**
 * Insert a user into the database
 * @param user User data to insert
 * @returns Promise with SQL command for inserting the data
 */
exports.insertUserInDb = function(user) {
    return sqlDb("usr")
        .insert(user)
        .timeout(2000, {cancel: true});
};

/**
 * Generate the query for getting all the cities registered to the system
 * @returns Knex promise with the query
 */
exports.queryAllCities = function () {
    return sqlDb("city")
        .select()
        .timeout(2000, {cancel: true})
};

/**
 * Insert city into the database
 * @param city City data to insert
 * @returns Promise with SQL command for inserting the data, that will return the inserted city's ID
 */
exports.insertCityInDb = function(city) {
    return sqlDb("city")
        .insert(city)
        .returning("id")
        .timeout(2000, {cancel: true});
};

/**
 * Insert organization into the database
 * @param organization Organization data to insert
 * @returns Promise with SQL command for inserting the data
 */
exports.insertOrganizationInDb = function(organization) {
    return sqlDb("organization")
        .insert(organization)
        .timeout(2000, {cancel: true});
};

/**
 * Insert report into the database
 * @param report Report data to insert
 * @returns Promise with SQL command for inserting the data, that will return the inserted report's ID
 */
exports.insertReportInDb = function (report) {
    return sqlDb("report")
        .insert(report)
        .returning("id")
        .timeout(2000, {cancel: true});
};
/*
/!**
 * Generate the query for getting the current value of an id sequence, given its table name
 * @param tableName Name of the table containing the sequence
 * @returns Knex promise with the query
 *!/
exports.queryCurrValOfIdSequence = function (tableName) {
    let stm = "currval('" + tableName + "_id_seq');";
    return sqlDb.select(sqlDb.raw(stm));
};*/

/**
 * Generate the query for retrieving a city from its name and region
 * @param name City's name
 * @param region City's region
 * @returns Knex promise with the query
 */
exports.queryCityByNameAndRegion = function (name, region) {
    return sqlDb("city")
        .select()
        .first()
        .where("name", name)
        .where("region", region)
        .timeout(2000, {cancel: true})
};

/**
 * Generate the query for retrieving a place from its city and address
 * @param city_id Id of the city where the place is in
 * @param address Address of the place
 * @returns Knex promise with the query
 */
exports.queryPlaceByCityAndAddress = function (city_id, address) {
    return sqlDb("place")
        .select()
        .first()
        .where("city_id", city_id)
        .where("region", address)
        .timeout(2000, {cancel: true})
};

/**
 * Generate the query for retrieving a location from its latitude and longitude
 * @param lat Latitude
 * @param lon Longitude
 * @returns Knex promise with the query
 */
exports.queryLocationByLatAndLon = function (lat, lon) {
    return sqlDb("location")
        .select()
        .first()
        .where("latitude", lat)
        .where("longitude", lon)
        .timeout(2000, {cancel: true})
};

/**
 * Insert place into the database
 * @param place Place data to insert
 * @returns Promise with SQL command for inserting the data, that will return the inserted place's ID
 */
exports.insertPlaceInDb = function(place) {
    return sqlDb("place")
        .insert(place)
        .returning("id")
        .timeout(2000, {cancel: true});
};

/**
 * Insert location into the database
 * @param location Location data to insert
 * @returns Promise with SQL command for inserting the data
 */
exports.insertLocationInDb = function(location) {
    return sqlDb("location")
        .insert(location)
        .timeout(2000, {cancel: true});
};

//module.exports = { setupDataLayer };