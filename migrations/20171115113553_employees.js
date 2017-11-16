
exports.up = function(knex, Promise) {
  return knex.schema.withSchema('public').createTable('employees', function(employee){
      employee.increments('id').primary();
      employee.string('employeeId').notNull().unique();
      employee.string('officeId').notNull();
      employee.foreign('officeId').references('offices.identifier');
      employee.decimal('age').nullable();
      employee.string('first_name').notNull();
      employee.string('last_name').notNull();
      employee.string('charge').notNull();
      employee.enum('human_robot', ['H','R']).notNull();
  });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('employees');
};
