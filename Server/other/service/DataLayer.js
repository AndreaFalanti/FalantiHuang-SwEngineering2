const knex = require("knex");
let knexConfig = require("../../knexfile");

let sqlDb = knex(knexConfig.development);
global.sqlDb = sqlDb;

//function used to setup all database tables required
async function setupDataLayer() {
    console.log("Setting up data layer...");
    await sqlDb.migrate.latest();
    await sqlDb.seed.run();
}

module.exports = { database: sqlDb, setupDataLayer };