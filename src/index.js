const express = require('express');
const body = require('body-parser');
const _ = require('lodash');
const officess = require('./officess'); 
const app = express();

app.listen(3000, function(){
    console.log('office app listening on 3000');
})

app.use(body.urlencoded({extended:false}));

app.use(body.json());

app.use('/officess', officess);

module.exports = app;