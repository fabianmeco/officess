
exports.up = function(knex, Promise) {
  return knex.schema.withSchema('public').createTable('offices', function(office){
      office.increments('id').primary();
      office.string('building').notNull();
      office.string('identifier').notNull().unique();
      office.decimal('floor').notNull();
      office.string('capacity').nullable();
      office.float('area').nullable();
      office.boolean('isAreaOffice').notNull();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('offices');
};
