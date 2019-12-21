let tableName = "city";

exports.up = function(knex) {
    return knex.schema.createTable(tableName, table => {
        table.increments("id").primary().index();
        table.text("name");
        table.text("region");
        console.log(`${tableName} database created`);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable(tableName);
};
