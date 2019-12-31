const knex = require("knex");
let knexConfig = require("../../knexfile");
require('dotenv').config();

const TIMEOUT_TIME = 2000;  // in milliseconds

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
        .timeout(TIMEOUT_TIME, {cancel: true})
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
        .timeout(TIMEOUT_TIME, {cancel: true})
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
        .timeout(TIMEOUT_TIME, {cancel: true})
};

/**
 * Generate the query for getting an organization, given its id.
 * @param id Organization id to search
 * @returns Knex promise with the query
 */
exports.queryOrganizationById = function (id) {
    return sqlDb("organization")
        .select()
        .where("id", id)
        .first()
        .timeout(TIMEOUT_TIME, {cancel: true})
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
        .timeout(TIMEOUT_TIME, {cancel: true})
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
        .timeout(TIMEOUT_TIME, {cancel: true})
};

/**
 * Insert a user into the database
 * @param user User data to insert
 * @returns Promise with SQL command for inserting the data
 */
exports.insertUserInDb = function(user) {
    return sqlDb("usr")
        .insert(user)
        .timeout(TIMEOUT_TIME, {cancel: true});
};

/**
 * Generate the query for getting all the cities registered to the system
 * @returns Knex promise with the query
 */
exports.queryAllCities = function () {
    return sqlDb("city")
        .select()
        .timeout(TIMEOUT_TIME, {cancel: true})
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
        .timeout(TIMEOUT_TIME, {cancel: true});
};

/**
 * Insert organization into the database
 * @param organization Organization data to insert
 * @returns Promise with SQL command for inserting the data
 */
exports.insertOrganizationInDb = function(organization) {
    return sqlDb("organization")
        .insert(organization)
        .timeout(TIMEOUT_TIME, {cancel: true});
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
        .timeout(TIMEOUT_TIME, {cancel: true});
};

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
        .timeout(TIMEOUT_TIME, {cancel: true})
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
        .where("address", address)
        .timeout(TIMEOUT_TIME, {cancel: true})
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
        .timeout(TIMEOUT_TIME, {cancel: true})
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
        .timeout(TIMEOUT_TIME, {cancel: true});
};

/**
 * Insert location into the database
 * @param location Location data to insert
 * @returns Promise with SQL command for inserting the data
 */
exports.insertLocationInDb = function(location) {
    return sqlDb("location")
        .insert(location)
        .timeout(TIMEOUT_TIME, {cancel: true});
};

/**
 * Update report with given id with photo paths
 * @param id Report ID
 * @param photos Photo's paths
 * @returns Promise with SQL command to update the tuple
 */
exports.updateReportWithPhotoPaths = function (id, photos) {
    return sqlDb("report")
        .where("id", id)
        .update({"photos": photos})
        .timeout(TIMEOUT_TIME, {cancel: true})
};

/**
 * Generate the query for retrieving a report from its id
 * @param id Report's id
 * @returns Knex promise with the query
 */
exports.queryReportById = function (id) {
    return sqlDb("report")
        .select()
        .first()
        .where("id", id)
        .timeout(TIMEOUT_TIME, {cancel: true})
};

/**
 * Generate the query for retrieving a report from its submitter's id
 * @param id Report's submitter id
 * @returns Knex promise with the query
 */
exports.queryReportsBySubmitterId = function (id) {
    return sqlDb("report")
        .select("report.id", "report.timestamp", "report.license_plate", "report.photos",
            "report.report_status", "report.violation_type", "report.latitude",
            "report.longitude", "place.address", "city.name")
        .join("location", function () {
            this.on("location.latitude", "report.latitude")
                .on("location.longitude", "report.longitude")
        })
        .innerJoin("place", "place.id", "location.place_id")
        .innerJoin("city", "city.id", "place.city_id")
        .where("report.submitter_id", id)
        .timeout(TIMEOUT_TIME, {cancel: true})
};

/**
 * Generate the query for retrieving a report from its city's id
 * @param id Report's city id
 * @returns Knex promise with the query
 */
exports.queryReportsByCityId = function (id) {
    return sqlDb("report")
        .select("report.*", "place.address", "city.name")
        .join("location", function () {
            this.on("location.latitude", "report.latitude")
                .on("location.longitude", "report.longitude")
        })
        .innerJoin("place", "place.id", "location.place_id")
        .innerJoin("city", "city.id", "place.city_id")
        .where("city.id", id)
        .timeout(TIMEOUT_TIME, {cancel: true})
};

/**
 * Generate the query for retrieving the city id from a given location
 * @param latitude Latitude
 * @param longitude Longitude
 * @returns Knex promise with the query
 */
exports.queryLocationForCityId = function (latitude, longitude) {
    return sqlDb("report")
        .select("place.city_id")
        .first()
        .join("location", function () {
            this.on("location.latitude", "report.latitude")
                .on("location.longitude", "report.longitude")
        })
        .innerJoin("place", "place.id", "location.place_id")
        .where("location.latitude", latitude)
        .where("location.longitude", longitude)
        .timeout(TIMEOUT_TIME, {cancel: true})
};

/**
 * Update report with given id with a new status and supervisor
 * @param id Report's id
 * @param status New status of the report
 * @param supervisor_id Id of the supervisor who submitted the new status
 * @returns Promise with SQL command to update the tuple
 */
exports.updateReportStatus = function (id, status, supervisor_id) {
    return sqlDb("report")
        .where("id", id)
        .update({"report_status": status, "supervisor_id": supervisor_id})
        .timeout(TIMEOUT_TIME, {cancel: true})
};

/**
 * Generate the query for getting reports that satisfy the request filters
 * @param from Date from which the reports must be searched
 * @param to Date to which the reports must be searched
 * @param type String with the type of violation
 * @param city Integer with city's id
 * @param restricted Boolean that indicate if need to restrict the data returned
 * @returns Knex promise with the query
 */
exports.queryReportsForAnalysis = function (from, to, type, city, restricted) {
    return sqlDb("report")
        .modify(query => {
            if (restricted) {
                query.select( "report.timestamp", "report.report_status", "report.violation_type",
                    "report.latitude", "report.longitude", "place.address", "city.name")
            }
            else {
                query.select("report.*", "place.address", "city.name")
            }
        })
        .join("location", function () {
            this.on("location.latitude", "report.latitude")
                .on("location.longitude", "report.longitude")
        })
        .innerJoin("place", "place.id", "location.place_id")
        .innerJoin("city", "city.id", "place.city_id")
        .where("report_status", "validated")
        .modify(query => {
            if (type) {
                query.where('violation_type', type)
            }
            if (typeof city !== 'undefined') {
                query.where('city.id', city)
            }
            if (from && to) {
                query.whereBetween('timestamp', [from, to])
            }
            else if (from) {
                query.where('timestamp', '>=', from)
            }
            else if (to) {
                query.where('timestamp', '<=', to)
            }
        })
        .timeout(TIMEOUT_TIME, {cancel: true})
};
