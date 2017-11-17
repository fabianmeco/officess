const knex = require('../helpers/knex');
const Assignments = {};

Assignments.create = function(assignment){
    return knex('assignments').insert(assignment);
}
Assignments.findAll = function(query){
    if(!query){
        query = {};
    }
    return knex.select('*').from('assignments').where(query);
}

Assignments.find = function(id){
    return Assignments.findAll({id:id}).first();
}

Assignments.remove = function(id) {
    return knex('assignments').where({id:id}).del();
}
Assignments.update = function(id, assignment){
    return knex('assignments').where({id:id}).update(assignment);
}

module.exports = Assignments;