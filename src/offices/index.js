"use strict"
const express = require('express');
const _ = require('lodash');
const body = require('body-parser');
const listRouter = express.Router();
const singleInstanceRouter = express.Router();
const schema = require('schema-object');
const employees = require('../employees');
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
    let officetmp = new office({
        "id": (arr.length + 1) + "",
        "building": req.body.building,
        "identifier": req.body.identifier,
        "floor": req.body.floor,
        "capacity": req.body.capacity,
        "area": req.body.area,
        "isAdminOffice": req.body.isAdminOffice
    });
    if (officetmp.isErrors()) {
        return res.status(422).json(officetmp.getErrors().map(function (err) {
            return { "message": err.errorMessage, "name": err.fieldSchema.name }
        }));
    }
    arr.push(officetmp);
    res.json(arr[arr.length - 1]);
});

listRouter.get('/', function (req, res) {
    if (_.isEmpty(req.query)) {
        return res.json(arr);
    }
    let office = new officeSearch(req.query);

    if (office.isErrors()) {

        return res.status(422).json(office.getErrors().map(function (err) {
            return { "message": err.errorMessage, "name": err.fieldSchema.name }
        }));
    }
    res.json(_.filter(arr, office));
});

function singleInstanceValidator(req, res, next) {
    let tmp = _.find(arr, { "id": req.params.id });
    if (tmp) {
        req.office = tmp;
        return next();
    }
    res.sendStatus(404);
}

listRouter.use('/:id', singleInstanceValidator, singleInstanceRouter);

singleInstanceRouter.get('/', function (req, res) {
    return res.json(req.office);
});
singleInstanceRouter.delete('/', function (req, res) {
    let tmp = _.pull(arr, req.office);
    return res.json(tmp[0]);
});

singleInstanceRouter.put('/', function (req, res) {
    let officeId = _.find(arr, { "identifier": req.body.identifier });
    if (officeId && officeId.id !== req.office.id) {
        return res.status(422).json({ "errorMessage": "Identifier already used", "name": "identifier" })
    }
    let officetmp = req.office.clone();
    _.assign(officetmp, req.body);
    if (officetmp.isErrors()) {
        return res.status(422).json(officetmp.getErrors().map(function (err) {
            return { "message": err.errorMessage, "name": err.fieldSchema.name }
        }));
    }
    _.assign(req.office, req.body);
    return res.json(req.office);

});

singleInstanceRouter.use("/employees", employees);

module.exports = listRouter;