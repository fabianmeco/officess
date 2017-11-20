"use strict"
const express = require('express');
const _ = require('lodash');
const schema = require('schema-object');
const listRouter = express.Router();
const singleInstanceRouter = express.Router();
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

listRouter.post('/', function(req, res){
   assignmentModel.find({"assignmentId": req.body.assignmentId}).then( function (found){
       if (found){
        return res.status(422).json([{"message":"The assignmentId should be unique", "name":"assignmentId"}]);
       }
       let assignment = new Assignment(req.body);
       if(assignment.isErrors()){        
           return res.status(422).json(assignment.getErrors().map(function(err){
               console.log(err.fieldSchema.name+' - '+err.errorMessage);
               return {"message": err.errorMessage, "name": err.fieldSchema.name};
           }));
       }
       return assignmentModel.create(req.body)    
   }).then(newAssignment => res.json(newAssignment))
   .catch(err => res.status(500).send(err.message));
    //Validate employeeId and return if not found
});
listRouter.get('/', function(req,res){
    if(_.isEmpty(req.query)){
        return assignmentModel.findAll().then(value => res.json(value)).catch(err => res.status(500).send(err.message));
    }
    let assignment = new Assignmentsearch(req.query);    
    if(assignment.isErrors()){
        
        return res.status(422).json(assignment.getErrors().map(function(err){
            return {"message":err.errorMessage, "name": err.fieldSchema.name}
        }));
    }
    return assignmentModel.findAll(req.query).then(value => res.json(value)).catch(err => res.status(500).send(err.message));    
});
function singleInstanceValidator(req, res, next){
    //let assignmenttmp = {}
    assignmentModel.find(re.params.id).then( function (value){
        if(value){
            req.assignment = assignmenttmp;
            return next();
        }
        return res.sendStatus(404);
    }).catch(err => res.status(500).send(err.message));
    
}
listRouter.use('/:id', singleInstanceValidator, singleInstanceRouter);

singleInstanceRouter.get('/', function(req, res){
    return res.json(req.assignment);
});
singleInstanceRouter.delete('/', function(req, res){
    return assignmentModel.remove(req.assignment.id).then(value => res.json(req.assignment)).catch(err => res.status(500).send(err.message));
});

singleInstanceRouter.put('/', function(req, res){
    assignmentModel.find({ assignmentId: req.assignment.assignmentId }).then(function (value) {
        if (value.id !== req.assignment.id) {
            return res.status(422).json({ "errorMessage": "Identifier already used", "name": "identifier" })
        }
        let assignmenttmp = new officeSearch(req.body);
        if (assignmenttmp.isErrors()) {
            return res.status(422).json(assignmenttmp.getErrors().map(function (err) {
                return { "message": err.errorMessage, "name": err.fieldSchema.name }
            }));
        }
        
    }).catch(err => res.status(500).send(err.message));
    return assignmentModel.update(req.assignment.id, req.body).then(value => res.json(req.assignment)).catch(err => res.status(500).send(err.message));

});

module.exports = listRouter;