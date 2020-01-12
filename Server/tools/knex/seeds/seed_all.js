let cityJson = require("../../../other/test_data/city.json");
let locationJson = require("../../../other/test_data/location.json");
let organizationJson = require("../../../other/test_data/organization.json");
let placeJson = require("../../../other/test_data/place.json");
let reportJson = require("../../../other/test_data/report.json");
let trafficViolationJson = require("../../../other/test_data/trafficViolation.json");
let usrJson = require("../../../other/test_data/user.json");

let tableObjs = [
    {name: "city", json: cityJson, setSequence: true},
    {name: "organization", json: organizationJson, setSequence: true},
    {name: "traffic_violation", json: trafficViolationJson, setSequence: false},
    {name: "place", json: placeJson, setSequence: true},
    {name: "location", json: locationJson, setSequence: false},
    {name: "usr", json: usrJson, setSequence: true},
    {name: "report", json: reportJson, setSequence: true}
];

exports.seed = async function (knex) {
    for (let tableObj of tableObjs) {
        await seedTable(knex, tableObj);
        console.log("Seeded table " + tableObj.name);
    }
};

let seedTable = function (knex, tableObj) {
    // Deletes ALL existing entries
    return knex(tableObj.name).del()
        .then(function () {
            // Inserts seed entries
            return knex(tableObj.name).insert(tableObj.json)
                .then(() => {
                    if (tableObj.setSequence) {
                        return setSequenceVal(knex, tableObj.name);
                    }
                });
        });
};

let setSequenceVal = function (knex, tableName) {
    let stm = "setval('" + tableName + "_id_seq', (SELECT MAX(id) from " + tableName + "));";
    return knex.select(knex.raw(stm));
};
