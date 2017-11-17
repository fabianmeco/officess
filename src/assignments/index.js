"use strict"
const express = require('express');
const _ = require('lodash');
const schema = require('schema-object');
const route = express.Router();
const assignmentModel = require('./assignments.model');

const arr = [];
//assignations: id, assignationId, description, map status
const Assignment = new schema({
    id:{type:String, required:true},
    employeeId:{type: String, required:true},
    assignmentId: {type:String, required:true},
    description: {type: String},
    status:{type: String, required: true, enum:["active", "pending", "inactive" ]}
},{setUndefined:true});


const Assignmentsearch = new schema({
    id:{type:String},
    employeeId:{type: String},
    assignmentId: {type:String},
    description: {type: String},
    status:{type: String, enum:["active", "pending", "inactive" ]}
},{setUndefined:false});

route.post('/', function(req, res){
    if(_.find(arr, {"assignmentId": req.body.assignmentId})){
        return res.status(422).json([{"message":"The assignmentId should be unique", "name":"assignmentId"}]);
    }
    //Validate employeeId and return if not found
    let assignment = new Assignment(req.body);
    if(assignment.isErrors()){        
        return res.status(422).json(assignment.getErrors().map(function(err){
            console.log(err.fieldSchema.name+' - '+err.errorMessage);
            return {"message": err.errorMessage, "name": err.fieldSchema.name};
        }));
    }
    return assignmentModel.create(req.body).then(value => res.json(req.body)).catch(err => res.status(500).send(err.message));    
});
route.get('/', function(req,res){
    if(_.isEmpty(req.query)){
        return assignmentModel.findAll(null).then(value => res.json(value)).catch(err => res.status(500).send(err.message));
    }
    let assignment = new Assignmentsearch(req.query);    
    if(assignment.isErrors()){
        
        return res.status(422).json(assignment.getErrors().map(function(err){
            return {"message":err.errorMessage, "name": err.fieldSchema.name}
        }));
    }
    return assignmentModel.findAll(req.query).then(value => res.json(value)).catch(err => res.status(500).send(err.message));    
});

route.get('/:id', function(req, res){
    let tmp = _.find(arr, {"id": req.params.id});
    if(tmp){
        return res.json(tmp);
    }
    res.status(404).json([{"message":"Assignmentid not found", "name": "id"}]);
});
route.delete('/:id', function(req, res){
    let tmp = _.remove(arr, function(assignment){
        return assignment.id === req.params.id
    });
    if(tmp.length>0){
        return res.json(tmp[0]);
    }
    res.status(404).json([{"message":"Assignmentid not found", "name": "id"}]);
    
});

route.put('/:id', function(req, res){
    let assignment = _.find(arr, {"id":req.params.id});
    if(!assignment){
        return res.status(404).json([{"message":"Assigmentid not found", "name":"id"}]);
    }
    let assignmentid = _.find(arr, {"assignmentId":req.body.assignmentId});    
    if(assignmentid && assignmentid.id !== assignment.id){
         return res.status(422).json([{"message": "Assignmentid already used", "name":"id"}])
    }
    let tmp_assign = assignment.clone();
    _.assign(tmp_assign, req.body);
    if(tmp_assign.isErrors()){
        return res.status(422).json(tmp_assign.getErrors().map(function(err){
            return {"message": err.errorMessage, "name": err.fieldSchema.name}
        }));
    }
    _.assign(assignment, req.body);
    return res.json(assignment);

});

module.exports = route;