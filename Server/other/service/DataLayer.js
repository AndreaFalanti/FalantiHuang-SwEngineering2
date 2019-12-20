const knex = require("knex");

let cityJson = require("../test_data/city.json");
let organizationJson = require("../test_data/organization.json");
let trafficViolationJson = require("../test_data/trafficViolation.json");
let locationJson = require("../test_data/location.json");
let placeJson = require("../test_data/place.json");
let userJson = require("../test_data/user.json");
let reportJson = require("../test_data/report.json");


let sqlDb = knex({
    client: "pg",
    connection: process.env.DATABASE_URL || {
        host : "localhost",
        user: process.argv[2],
        password: process.argv[3],
        database: 'safestreets'
    },
    ssl: true,
    debug: true
});

global.sqlDb = sqlDb;

cityDbSetup = function(database) {
    let tableName = "city";
    return database.schema.hasTable(tableName).then(exists => {
        if (!exists) {
            return database.schema.createTable(tableName, table => {
                table.increments("id").primary().index();
                table.text("name");
                table.text("region");
                console.log(`${tableName} database created`);
            }).then(() => {
                return Promise.all(
                    cityJson.map(e => {
                        return sqlDb(tableName).insert(e);
                    })
                ).then(() => {
                    let stm = "setval('" + tableName + "_id_seq', (SELECT MAX(id) from " + tableName + "));";
                    return database.select(database.raw(stm));
                });
            });
        }
        else {
            console.log(`${tableName} database already existing`);
        }
    });
};

organizationDbSetup = function(database) {
    let tableName = "organization";
    return database.schema.hasTable(tableName).then(exists => {
        if (!exists) {
            return database.schema.createTable(tableName, table => {
                table.increments("id").primary().index();
                table.text("name");
                table.text("domain").unique();
                table.enum("type", ["system", "authority"]);
                table.integer("city_id").index().references("id").inTable("city");
                console.log(`${tableName} database created`);
            }).then(() => {
                return Promise.all(
                    organizationJson.map(e => {
                        return sqlDb(tableName).insert(e);
                    })
                ).then(() => {
                    let stm = "setval('" + tableName + "_id_seq', (SELECT MAX(id) from " + tableName + "));";
                    return database.select(database.raw(stm));
                });
            });
        }
        else {
            console.log(`${tableName} database already existing`);
        }
    });
};

trafficViolationDbSetup = function(database) {
    let tableName = "traffic_violation";
    return database.schema.hasTable(tableName).then(exists => {
        if (!exists) {
            return database.schema.createTable(tableName, table => {
                table.text("type").primary().index();
                table.text("description");
                console.log(`${tableName} database created`);
            }).then(() => {
                return Promise.all(
                    trafficViolationJson.map(e => {
                        return sqlDb(tableName).insert(e);
                    })
                );
            });
        }
        else {
            console.log(`${tableName} database already existing`);
        }
    });
};

placeDbSetup = function(database) {
    let tableName = "place";
    return database.schema.hasTable(tableName).then(exists => {
        if (!exists) {
            return database.schema.createTable(tableName, table => {
                table.increments("id").primary().index();
                table.integer("city_id").index().references("id").inTable("city");
                table.text("address");
                console.log(`${tableName} database created`);
            }).then(() => {
                return Promise.all(
                    placeJson.map(e => {
                        return sqlDb(tableName).insert(e);
                    })
                ).then(() => {
                    let stm = "setval('" + tableName + "_id_seq', (SELECT MAX(id) from " + tableName + "));";
                    return database.select(database.raw(stm));
                });
            });
        }
        else {
            console.log(`${tableName} database already existing`);
        }
    });
};

locationDbSetup = function(database) {
    let tableName = "location";
    return database.schema.hasTable(tableName).then(exists => {
        if (!exists) {
            return database.schema.createTable(tableName, table => {
                table.decimal("latitude", null);
                table.decimal("longitude", null);
                table.integer("place_id").index().references("id").inTable("place");
                table.primary(["latitude", "longitude"]);
                console.log(`${tableName} database created`);
            }).then(() => {
                return Promise.all(
                    locationJson.map(e => {
                        return sqlDb(tableName).insert(e);
                    })
                );
            });
        }
        else {
            console.log(`${tableName} database already existing`);
        }
    });
};

userDbSetup = function(database) {
    // set local reference to database
    sqlDb = database;
    let tableName = "usr";
    return database.schema.hasTable(tableName).then(exists => {
        if (!exists) {
            return database.schema.createTable(tableName, table => {
                table.increments("id").index().primary();
                table.text("email").unique();
                table.text("firstname");
                table.text("lastname");
                table.text("password");
                table.integer("organization_id").nullable().index().references("id").inTable("organization");
                console.log(`${tableName} database created`);
            }).then(() => {
                return Promise.all(
                    userJson.map(e => {
                        return sqlDb(tableName).insert(e);
                    })
                ).then(() => {
                    let stm = "setval('" + tableName + "_id_seq', (SELECT MAX(id) from " + tableName + "));";
                    return database.select(database.raw(stm));
                });
            });
        }
        else {
            console.log(`${tableName} database already existing`);
        }
    });
};

reportDbSetup = function(database) {
    let tableName = "report";
    return database.schema.hasTable(tableName).then(exists => {
        if (!exists) {
            return database.schema.createTable(tableName, table => {
                table.increments("id").primary().index();
                table.timestamp("timestamp");
                table.text("license_plate");
                table.specificType("photos", "TEXT[]");     // array of URI
                table.enum("report_status", ["pending", "validated", "invalidated"]);
                table.text("violation_type").references("type").inTable("traffic_violation");
                table.decimal("latitude", null);
                table.decimal("longitude", null);
                table.foreign(["latitude", "longitude"]).references(["latitude", "longitude"]).inTable("location");
                table.integer("submitter_id").index().references("id").inTable("usr");
                table.integer("supervisor_id").index().references("id").inTable("usr");
                console.log(`${tableName} database created`);
            }).then(() => {
                return Promise.all(
                    reportJson.map(e => {
                        return sqlDb(tableName).insert(e);
                    })
                ).then(() => {
                    let stm = "setval('" + tableName + "_id_seq', (SELECT MAX(id) from " + tableName + "));";
                    return database.select(database.raw(stm));
                });
            });
        }
        else {
            console.log(`${tableName} database already existing`);
        }
    });
};

//function used to setup all database tables required
async function setupDataLayer() {
    console.log("Setting up data layer...");
    await cityDbSetup(sqlDb);
    await organizationDbSetup(sqlDb);
    await trafficViolationDbSetup(sqlDb);
    await placeDbSetup(sqlDb);
    await locationDbSetup(sqlDb);
    await userDbSetup(sqlDb);
    await reportDbSetup(sqlDb);
}

module.exports = { database: sqlDb, setupDataLayer };