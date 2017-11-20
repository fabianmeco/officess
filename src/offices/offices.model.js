const knex=require('../helpers/knex');
const Office = {};

Office.create = function(office){
    return knex('offices').insert(office);    
};
Office.findAll = function(query){
    
    if(!query){
        query = {}
    }        
    return knex.select('*').from('offices').where(query);
    
};
Office.find = function(query){
    return Office.findAll(query).first();
}
Office.update = function(id, office){
    return knex('offices').where({id:id}).update(office).first();
}
Office.remove = function(id){
    return knex('offices').where({id:id}).del();
}

module.exports = Office;

