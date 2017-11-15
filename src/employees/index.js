"use strict"
//employees: id, employeeId, age, name, last name, charge, map human robot
const express = require('express');
const _ = require('lodash');
const schema = require('schema-object');
const route = express.Router();
const office = require('../offices');
const arr = [];

const Employee = new schema({
    id:{ type: String, required: true},
    employeeId: { type: String, required: true},
    officeId:{ type: String, require:true},
    age: { type: Number},
    first_name: { type: String, required: true},
    last_name: { type: String, required: true},
    charge: { type: String, required: true},
    human_robot: { type: String, required: true, enum:['H', 'R']}
},{setUndefined:true});

const EmployeeSearch = new schema({
    id:{ type: String },    
    employeeId: { type: String },
    officeId: {type: String},
    age: { type: Number },
    first_name: { type: String },
    last_name: { type: String },
    charge: { type: String },
    human_robot: { type: String, enum:['H', 'R']}
},{setUndefined:false});

route.post('/', function(req, res){
    if(_.find(arr, {"employeeId": req.body.employeeId})){
        return res.status(422).json([{"message":"The employeeId should be unique", "name":"employeeId"}]);
    }
    //Validate officeId and return if not found
    let employee = new Employee({
        "id": (arr.length+1)+'',
        "employeeId":req.body.employeeId,
        "officeId": req.body.officeId,
        "age" :  req.body.age,
        "first_name": req.body.first_name,
        "last_name": req.body.last_name,
        "charge" : req.body.charge,
        "human_robot": req.body.human_robot
    });
    if(employee.isErrors()){        
        return res.status(422).json(employee.getErrors().map(function(err){
            console.log(err.fieldSchema.name+err.errorMessage);
            return {"message": err.errorMessage, "name": err.fieldSchema.name};
        }));
    }
    arr.push(employee);
    res.json(arr[arr.length-1]);
});
route.get('/', function(req,res){
    if(_.isEmpty(req.query)){
        return res.json(arr);
    }
    let employee = new EmployeeSearch(req.query);
    
    if(employee.isErrors()){
        
        return res.status(422).json(employee.getErrors().map(function(err){
            return {"message":err.errorMessage, "name": err.fieldSchema.name}
        }));
    }
    res.json(_.filter(arr, employee));
});

route.get('/:id', function(req, res){
    let tmp = _.find(arr, {"id": req.params.id});
    if(tmp){
        return res.json(tmp);
    }
    res.status(404).json([{"message":"Employee not found", "name": "id"}]);
});
route.delete('/:id', function(req, res){
    let tmp = _.remove(arr, function(employee){
        return employee.id === req.params.id
    });
    if(tmp.length>0){
        return res.json(tmp[0]);
    }
    res.status(404).json([{"message":"Employee not found", "name": "id"}]);
    
});

route.put('/:id', function(req, res){
    let employee = _.find(arr, {"id":req.params.id});
    if(!employee){
        return res.status(404).json([{"message":"Employee not found", "name":"id"}]);
    }
    let employeeid = _.find(arr, {"employeeId":req.body.employeeId});    
    if(employeeid && employeeid.id !== employee.id){
         return res.status(422).json([{"message": "EmployeeId already used", "name":"employeeId"}])
    }
    let tmp_employee = employee.clone();
    _.assign(tmp_employee, req.body);
    if(tmp_employee.isErrors()){
        return res.status(422).json(tmp_employee.getErrors().map(function(err){
            return {"message": err.errorMessage, "name": err.fieldSchema.name}
        }));
    }
    _.assign(employee, req.body);
    return res.json(employee);

});

module.exports = route;