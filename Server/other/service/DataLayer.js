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
 */
exports.insertCityInDb = function(city) {
    return sqlDb("city")
        .insert(city)
        .timeout(2000, {cancel: true});
};

/**
 * Insert organization into the database
 * @param organization Organization data to insert
 */
exports.insertOrganizationInDb = function(organization) {
    return sqlDb("organization")
        .insert(organization)
        .timeout(2000, {cancel: true});
};

//module.exports = { setupDataLayer };