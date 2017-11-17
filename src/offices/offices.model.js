const knex=require('../helpers/knex');
const Office = {};

Office.create = function(office){
    return knex('offices').insert(office);    
};
Office.find = function(office){
    return knex.select(office).from('offices');
};
Office.updateByID = function(office){
    return knex('offices').where('identifier','=', office.identifier).update({});
}


