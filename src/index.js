const express = require('express');
const body = require('body-parser');
const _ = require('lodash');
const offices = require('./offices'); 
const employees = require('./employees');
const assignments = require('./assignments');
const app = express();

app.listen(3000, function(){
    console.log('office app listening on 3000');
})

app.use(body.urlencoded({extended:false}));

app.use(body.json());

app.use('/offices', offices);

app.use('/employees', employees);

app.use('/assignments', assignments);

module.exports = app;