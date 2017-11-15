const knex=require('../helpers/knex');
const Office = {};

Office.create = function(office){
    return knex('offices').insert(office);    
};