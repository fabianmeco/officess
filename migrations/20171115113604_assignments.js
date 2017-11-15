
exports.up = function(knex, Promise) {
  return knex.schema.withSchema('public').createTable('assignments', function(assignment){
    assignment.increments('id').primary();
    assignment.string('assignmentId').unique();
    assignment.string('employeeId').notNull();
    assignment.foreign('employeeId').references('employees.employeeId');
    assignment.string('description').nullable();
    assignment.enum('status', ["active", "pending", "inactive"]).notNull();
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('assignments');
};
