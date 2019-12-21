let tableName = "location";

exports.up = function(knex) {
    return knex.schema.createTable(tableName, table => {
        table.decimal("latitude", null);
        table.decimal("longitude", null);
        table.integer("place_id").index().references("id").inTable("place")
            .onDelete('CASCADE').onUpdate('CASCADE');
        table.primary(["latitude", "longitude"]);
        console.log(`${tableName} database created`);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable(tableName);
};
