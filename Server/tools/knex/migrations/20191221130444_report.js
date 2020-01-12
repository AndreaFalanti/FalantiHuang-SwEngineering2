let tableName = "report";

exports.up = function(knex) {
    return knex.schema.createTable(tableName, table => {
        table.increments("id").primary().index();
        table.timestamp("timestamp");
        table.text("license_plate");
        table.specificType("photos", "TEXT[]");     // array of URI
        table.enum("report_status", ["pending", "validated", "invalidated"]);
        table.text("violation_type").references("type").inTable("traffic_violation")
            .onDelete('CASCADE').onUpdate('CASCADE');
        table.text("desc").nullable();
        table.decimal("latitude", null);
        table.decimal("longitude", null);
        table.foreign(["latitude", "longitude"]).references(["latitude", "longitude"]).inTable("location")
            .onDelete('CASCADE').onUpdate('CASCADE');
        table.integer("submitter_id").index().references("id").inTable("usr")
            .onDelete('CASCADE').onUpdate('CASCADE');
        table.integer("supervisor_id").index().references("id").inTable("usr")
            .onDelete('CASCADE').onUpdate('CASCADE');
        console.log(`${tableName} database created`);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable(tableName);
};
