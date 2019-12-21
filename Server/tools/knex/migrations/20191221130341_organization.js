let tableName = "organization";

exports.up = function(knex) {
    return knex.schema.createTable(tableName, table => {
        table.increments("id").primary().index();
        table.text("name");
        table.text("domain").unique();
        table.enum("type", ["system", "authority"]);
        table.integer("city_id").index().references("id").inTable("city")
            .onDelete('CASCADE').onUpdate('CASCADE');
        console.log(`${tableName} database created`);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable(tableName);
};
