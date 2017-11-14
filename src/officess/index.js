"use strict"
const express = require('express');
const _ = require('lodash');
const body = require('body-parser');
const route = express.Router();
const schema = require('schema-object');

const arr = [];

const office = new schema({
    id: {type: String, required: true },
    building: {type: String, required: true},
    identifier: {type: String, required: true},
    floor: {type: Number, required: true},
    capacity: String,
    area: Number,
    isAdminOffice : {type: Boolean, required: true} //defines if the office is admin or comon area, true=admin, false=common area

}, { setUndefined: true});

const officeSearch = new schema({
    id: String,
    building: String,
    identifier: String,
    floor: Number,
    capacity: String,
    area: Number,
    isAdminOffice : Boolean //defines if the office is admin or comon area, true=admin, false=common area

}, { setUndefined: false});

route.use(function timeLog(req, res, next){
    next();
});
//id, building, identifier, floor,capacity, area, bool-admin office or common area
//employees: id, employeeId, age, name, last name, charge, map human robot
//assignations: id, assignationId, description, map status
route.post('/', function(req, res){
    if(_.find(arr, {"identifier":req.body.identifier})){
        return res.status(422).json([{"message":"The identifier should be unique", "name":"identifier"}]);
    }
    let officetmp = new office({
        "id":(arr.length+1)+"",
        "building": req.body.building,
        "identifier": req.body.identifier,
        "floor": req.body.floor,
        "capacity": req.body.capacity,
        "area": req.body.area,
        "isAdminOffice": req.body.isAdminOffice
    });
    if(officetmp.isErrors()){
        return res.status(422).json(officetmp.getErrors().map(function(err){
            return {"message":err.errorMessage, "name": err.fieldSchema.name}
        }));
    }
    arr.push(officetmp);
    res.json(arr[arr.length-1]);
});

route.get('/', function(req,res){
    if(_.isEmpty(req.query)){
        return res.json(arr);
    }
    let office = new officeSearch(req.query);
    if(office.isErrors()){
        return res.status(422).json(office.getErrors().map(function(){
            return {"message":err.errorMessage, "name": err.fieldSchema.name}
        }));
    }
    res._.filter(arr, office);
});

route.get('/:id', function(req, res){
    let tmp = _.find(arr, {"id": req.params.id});
    if(tmp){
        return res.json(tmp);
    }
    res.status(404).json({"errorMessage":"Office not found"});
});
route.delete('/:id', function(req, res){
    let tmp = _.remove(arr, function(){
        return office.id === req.params.id
    });
    if(tmp.length>0){
        return res.json(tmp[0]);
    }
    res.status(404).json({"errorMessage":"Office not found"});
    
});

route.put('/:id', function(req, res){
    let office = _.find(arr, {"id":req.params.id});
    if(!office){
        return res.status(404);
    }
    let officeId = _.find(arr, {"identifier":req.body.identifier});
    if(officeId && officeId.identifier !== req.body.identifier){
        return res.status(422).json({"errorMessage": "Identifier already used"})
    }
    let officetmp = office.clone();
    _.assign(officetmp, req.body);
    if(officetmp.isErrors()){
        return res.status(422).json(officetmp.getErrors().map(function(err){
            return {"message": err.errorMessage, "name": err.fieldSchema.name}
        }));
    }
    _.assign(office, req.body);
    return res.json(office);

});


module.exports=route;