let tableName = "city";

exports.up = function(knex) {
    return knex.schema.createTable(tableName, table => {
        table.increments("id").primary().index();
        table.text("name");
        table.text("region");
        table.unique(["name", "region"]);
        console.log(`${tableName} database created`);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable(tableName);
};
