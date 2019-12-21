let tableName = "traffic_violation";

exports.up = function(knex) {
    return knex.schema.createTable(tableName, table => {
        table.text("type").primary().index();
        table.text("description");
        console.log(`${tableName} database created`);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable(tableName);
};
