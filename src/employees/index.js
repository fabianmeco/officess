"use strict"
//employees: id, employeeId, age, name, last name, charge, map human robot
const express = require('express');
const _ = require('lodash');
const schema = require('schema-object');
const listRouter = express.Router();
const singleInstanceRouter = express.Router();
const assignment = require('../assignments');
const employeeModel = require('./employees.model');
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

listRouter.post('/', function(req, res){
    //find the username inside the db
    employeeModel.find({"employeeId": req.body.employeeId}).then(function(found){
        if(found){
            return res.status(422).json([{"message":"The employeeId should be unique", "name":"employeeId"}]);
        }
        req.body.officeId = req.office.officeId;
        let employee = new Employee(req.body);
        if(employee.isErrors()){        
            return res.status(422).json(employee.getErrors().map(function(err){
                console.log(err.fieldSchema.name+err.errorMessage);
                return {"message": err.errorMessage, "name": err.fieldSchema.name};
            }));
        }
        return employeeModel.create(req.body)    

    })
    .then(newEmployee => res.json(newEmployee))
    .catch(err => res.status(500).send(err.message));    
    //Validate officeId and return if not found
    
});
listRouter.get('/', function(req,res){
    if(_.isEmpty(req.query)){
        return employeeModel.findAll().then(value => res.json(value)).catch(err => res.status(500).send(err.message));
    }
    let employee = new EmployeeSearch(req.query);    
    if(employee.isErrors()){        
        return res.status(422).json(employee.getErrors().map(function(err){
            return {"message":err.errorMessage, "name": err.fieldSchema.name}
        }));
    }
    employeeModel.findAll(req.query).then(value => res.json(value)).catch(err => res.status(500).send(err.message));    
});

function singleInstanceValidator(req, res, next){
    let employeetemp = {};
    employeeModel.find(req.params.employeeId).then(function(value) {
        if(value){
            req.employee = employeetemp;
            return next();
        }
        return res.sendStatus(404);
    } ).catch(err => res.status(500).send(err.message));
    //_.find(arr, {"employeeId": req.params.employeeId});
    
}

listRouter.use('/:employeeId', singleInstanceValidator, singleInstanceRouter);

singleInstanceRouter.get('/', function(req, res){
    return res.json(req.employee);
});
singleInstanceRouter.delete('/', function(req, res){
    return employeeModel.remove(req.params.employeeId).then(value => res.json(value)).catch(err => res.status(500).send(err.message));    
});

singleInstanceRouter.put('/', function(req, res){
    employeeModel.find({ employeeId: req.office.employeeId }).then(function (value) {
        if (value.id !== req.employee.id) {
            return res.status(422).json({ "errorMessage": "Identifier already used", "name": "identifier" })
        }
        let employeetmp = new officeSearch(req.body);
        if (employeetmp.isErrors()) {
            return res.status(422).json(employeetmp.getErrors().map(function (err) {
                return { "message": err.errorMessage, "name": err.fieldSchema.name }
            }));
        }
        
    }).catch(err => res.status(500).send(err.message));
    
    return employeeModel.update(req.employee.id, req.body).then(value => res.json(value)).catch(err => res.status(500).send(err.message));
    
});

singleInstanceRouter.use('/assignments', assignment);

module.exports = listRouter;