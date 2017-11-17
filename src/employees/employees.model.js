const knex = require('../helpers/knex');
const Employee = {}

Employee.create = function(employee){
    return knex('employees').insert(employee);
}
Employee.findAll = function(query){
    if(!query){
        quety = {}
    }
    return knex.select('*').from('employees').where(query);
}
Employee.find = function(id){
    return Employee.findAll({id:id}).first();
}
Employee.remove = function(id){
    return knex('employees').where({id:id}).del();
}
Employee.update = function(id, employee){
    return knex('employees').where({id:id}).update(employee);
}


module.exports = Employee;