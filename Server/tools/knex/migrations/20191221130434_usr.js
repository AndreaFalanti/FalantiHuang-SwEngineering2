let tableName = "usr";

exports.up = function(knex) {
    return knex.schema.createTable(tableName, table => {
        table.increments("id").index().primary();
        table.text("email").unique();
        table.text("firstname");
        table.text("lastname");
        table.text("password");
        table.integer("organization_id").nullable().index().references("id").inTable("organization")
            .onDelete('CASCADE').onUpdate('CASCADE');
        console.log(`${tableName} database created`);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable(tableName);
};
