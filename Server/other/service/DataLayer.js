const knex = require("knex");
let knexConfig = require("../../knexfile");
require('dotenv').config();

let sqlDb = knex(knexConfig[process.env.NODE_ENV]);
global.sqlDb = sqlDb;

//function used to setup all database tables required
async function setupDataLayer() {
    if (process.env.NODE_ENV === 'development') {
        console.log("Setting up data layer...");
        await sqlDb.migrate.latest();
        await sqlDb.seed.run();
    }
}

module.exports = { database: sqlDb, setupDataLayer };