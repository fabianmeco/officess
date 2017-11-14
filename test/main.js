const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/index');

chai.use(chaiHttp);


global.should = chai.should();
global.expect = chai.expect;
global.assert = chai.assert;
global.app = app;
global.chai = chai;

console.log('Something');