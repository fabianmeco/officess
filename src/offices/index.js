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

const office = new schema({
    id: { type: String, required: true },
    building: { type: String, required: true },
    identifier: { type: String, required: true },
    floor: { type: Number, required: true },
    capacity: String,
    area: Number,
    isAdminOffice: { type: Boolean, required: true } //defines if the office is admin or comon area, true=admin, false=common area

}, { setUndefined: true });

const officeSearch = new schema({
    id: { type: String },
    building: { type: String },
    identifier: { type: String },
    floor: { type: Number },
    capacity: { type: String },
    area: { type: Number },
    isAdminOffice: { type: Boolean } //defines if the office is admin or comon area, true=admin, false=common area

}, { setUndefined: false });

listRouter.use(function timeLog(req, res, next) {
    next();
});
//id, building, identifier, floor,capacity, area, bool-admin office or common area
//employees: id, employeeId, age, name, last name, charge, map human robot
//assignations: id, assignationId, description, map status
listRouter.post('/', function (req, res) {
    if (_.find(arr, { "identifier": req.body.identifier })) {
        return res.status(422).json([{ "message": "The identifier should be unique", "name": "identifier" }]);
    }
    let officetmp = new office(req.body);
    if (officetmp.isErrors()) {
        return res.status(422).json(officetmp.getErrors().map(function (err) {
            return { "message": err.errorMessage, "name": err.fieldSchema.name }
        }));
    }
    officeModel.create(req.body).then(value => res.json(req.body)).catch(err => res.status(500).send(err.message));
});

listRouter.get('/', function (req, res) {
    if (_.isEmpty(req.query)) {
        return officeModel.findAll(null).then(value => res.json(value)).catch(err.status(500).send(err.message));
    }
    let office = new officeSearch(req.query);
    if (office.isErrors()) {

        return res.status(422).json(office.getErrors().map(function (err) {
            return { "message": err.errorMessage, "name": err.fieldSchema.name }
        }));
    }
    officeModel.findAll(req.query).then(value => res.json(value)).catch(err.status(500).send(err.message));
});

function singleInstanceValidator(req, res, next) {
    let officetmp = {};
    officeModel.find(req.params.id).then(value => officetmp=value).catch(err => res.status(500).send(err.message));
    if (officetmp) {
        req.office = officetmp;
        return next();
    }
    res.sendStatus(404);
}

listRouter.use('/:id', singleInstanceValidator, singleInstanceRouter);

singleInstanceRouter.get('/', function (req, res) {
    return res.json(req.office);
});
singleInstanceRouter.delete('/', function (req, res) {
    officeModel.remove(req.office.id).then(value => res.json(req.office)).catch(err => res.status(500).send(err.message));
});

singleInstanceRouter.put('/', function (req, res) {
    if (req.params.id !== req.office.id) {
        return res.status(422).json({ "errorMessage": "Identifier already used", "name": "identifier" })
    }
    let officetmp = req.office.clone();
    _.assign(officetmp, req.body);
    if (officetmp.isErrors()) {
        return res.status(422).json(officetmp.getErrors().map(function (err) {
            return { "message": err.errorMessage, "name": err.fieldSchema.name }
        }));
    }
    return officeModel.update(req.office.id, req.body).then(value => res.json(req.office)).catch(err => res.status(500).send(err.message));


});

singleInstanceRouter.use("/employees", employees);

module.exports = listRouter;