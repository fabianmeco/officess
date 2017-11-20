"use strict"
const express = require('express');
const _ = require('lodash');
const body = require('body-parser');
const listRouter = express.Router();
const singleInstanceRouter = express.Router();
const schema = require('schema-object');
const employees = require('../employees');
const officeModel = require('./offices.model');
const arr = [];

const Office = new schema({
    id: { type: String },
    building: { type: String, required: true },
    identifier: { type: String, required: true },
    floor: { type: Number, required: true },
    capacity: String,
    area: Number,
    isAreaOffice: { type: Boolean, required: true } //defines if the office is admin or comon area, true=admin, false=common area

}, { setUndefined: true });

const officeSearch = new schema({
    building: { type: String },
    identifier: { type: String },
    floor: { type: Number },
    capacity: { type: String },
    area: { type: Number },
    isAreaOffice: { type: Boolean } //defines if the office is admin or comon area, true=admin, false=common area

}, { setUndefined: false });

listRouter.use(function timeLog(req, res, next) {
    next();
});
//id, building, identifier, floor,capacity, area, bool-admin office or common area
//employees: id, employeeId, age, name, last name, charge, map human robot
//assignations: id, assignationId, description, map status
listRouter.post('/', function (req, res) {

    officeModel.find({ "identifier": req.body.identifier }).then(function (found) {
        if (found) {
            return res.status(422).json([{ "message": "The officeId should be unique", "name": "identifier" }]);
        }
        let office = new Office(req.body);
        if (office.isErrors()) {
            return res.status(422).json(office.getErrors().map(function (err) {
                console.log(err.fieldSchema.name + err.errorMessage);
                return { "message": err.errorMessage, "name": err.fieldSchema.name };
            }));
        }
        return officeModel.create(req.body)

    })
        .then(newOffice => res.json(newOffice))
        .catch(err => res.status(500).send(err.message));
});

listRouter.get('/', function (req, res) {
    if (_.isEmpty(req.query)) {
        return officeModel.findAll().then(value => res.json(value)).catch(err => err.status(500).send(err.message));
    }
    let office = new officeSearch(req.query);
    if (office.isErrors()) {

        return res.status(422).json(office.getErrors().map(function (err) {
            return { "message": err.errorMessage, "name": err.fieldSchema.name }
        }));
    }
    return officeModel.findAll(req.query).then(value => res.json(value)).catch(err => err.status(500).send(err.message));
});

function singleInstanceValidator(req, res, next) {
    let officetmp = {};
    officeModel.find({ id: req.params.id }).then(function (record) {
        officetmp = record;
        if (officetmp) {
            req.office = officetmp;
            return next();
        }
        return res.sendStatus(404);
    }).catch(err => res.status(500).send(err.message));

    //res.sendStatus(404);
}

listRouter.use('/:id', singleInstanceValidator, singleInstanceRouter);

singleInstanceRouter.get('/', function (req, res) {
    return res.json(req.office);
});
singleInstanceRouter.delete('/', function (req, res) {
    officeModel.remove(req.office.id).then(value => res.json(req.office)).catch(err => res.status(500).send(err.message));
});

singleInstanceRouter.put('/', function (req, res) {
    officeModel.find({ identifier: req.office.identifier }).then(function (value) {
        if (value.id !== req.office.id) {
            return res.status(422).json({ "errorMessage": "Identifier already used", "name": "identifier" })
        }
        let officetmp = new officeSearch(req.body);
        if (officetmp.isErrors()) {
            return res.status(422).json(officetmp.getErrors().map(function (err) {
                return { "message": err.errorMessage, "name": err.fieldSchema.name }
            }));
        }
        
    }).catch(err => res.status(500).send(err.message));
    return officeModel.update(req.office.id, req.body).then(function (newOffice){
        console.log(newOffice);
        res.json(newOffice);
    });
});

singleInstanceRouter.use("/employees", employees);

module.exports = listRouter;