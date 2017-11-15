"use strict"
//employees: id, employeeId, age, name, last name, charge, map human robot
const express = require('express');
const _ = require('lodash');
const schema = require('schema-object');
const listRouter = express.Router();
const singleInstanceRouter = express.Router();
const assignment = require('../assignments');
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
    if(_.find(arr, {"employeeId": req.body.employeeId})){
        return res.status(422).json([{"message":"The employeeId should be unique", "name":"employeeId"}]);
    }
    //Validate officeId and return if not found
    let employee = new Employee({
        "id": (arr.length+1)+'',
        "employeeId":req.body.employeeId,
        "officeId": req.params.id,
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
listRouter.get('/', function(req,res){
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

function singleInstanceValidator(req, res, next){
    let tmp = _.find(arr, {"employeeId": req.params.employeeId});
    if(tmp){
        req.employee = tmp;
        return next();
    }
    res.sendStatus(404);
}

listRouter.use('/:employeeId', singleInstanceValidator, singleInstanceRouter);

singleInstanceRouter.get('/', function(req, res){
    return res.json(req.employee);
});
singleInstanceRouter.delete('/', function(req, res){
    let tmp = _.pull(arr, req.employee)
    return res.json(tmp[0]);   
});

singleInstanceRouter.put('/', function(req, res){
    let employeeid = _.find(arr, {"employeeId":req.body.employeeId});    
    if(employeeid && employeeid.id !== req.employee.id){
         return res.status(422).json([{"message": "EmployeeId already used", "name":"employeeId"}])
    }
    let tmp_employee = req.employee.clone();
    _.assign(tmp_employee, req.body);
    if(tmp_employee.isErrors()){
        return res.status(422).json(tmp_employee.getErrors().map(function(err){
            return {"message": err.errorMessage, "name": err.fieldSchema.name}
        }));
    }
    _.assign(req.employee, req.body);
    return res.json(req.employee);

});

singleInstanceRouter.use('/assignments', assignment);

module.exports = listRouter;