let tableName = "place";

exports.up = function(knex) {
    return knex.schema.createTable(tableName, table => {
        table.increments("id").primary().index();
        table.integer("city_id").index().references("id").inTable("city")
            .onDelete('CASCADE').onUpdate('CASCADE');
        table.text("address");
        console.log(`${tableName} database created`);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable(tableName);
};
