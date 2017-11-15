const fixtures = require('./employees.fixtures');

describe('employees', function(){
    describe('[POST] /employees', function(){
        it('Should create a new employee', function(done){
            chai.request(app).post('/employees').send(fixtures.post.employee).end(function(err, res){
                should.not.exist(err);
                should.exist(res);
                res.body.should.be.an('object');
                res.body.employeeId.should.be.a('string');
                done();
            })
        });
        it('It should\'t create a new employee with existing employeeId', function(done){
            chai.request(app).post('/employees').send(fixtures.post.employee).end(function(err, res){
                should.exist(err);
                expect(res).to.have.status(422);
                res.body.should.be.an('array');
                res.body[0].message.should.be.a('string');
                res.body[0].name.should.be.equal('employeeId');
                done();
            })
        });
        it('It should\'t create a new employee without required attributes', function(done){
            chai.request(app).post('/employees').send(fixtures.post.employeew).end(function(err,res){
                should.exist(err);
                expect(res).to.have.status(422);
                res.body.should.be.an('array'); 
                res.body[0].name.should.be.equal('employeeId');
                done();
            })
        });
        it('It shouldn\'t create a new employee with wrong attributes', function(done){
            chai.request(app).post('/employees').send(fixtures.post.employeebad).end(function(err, res){
               should.exist(err);
               expect(res).to.have.status(422);
               res.body[0].name.should.be.equal('age');
               done();
            })
        });
        it('It should create a new employee with unrequired attributes', function(done){
            chai.request(app).post('/employees').send(fixtures.post.employeegood).end(function(err, res){
                should.not.exist(err);
                expect(res.body.age).to.be.undefined;
                done();
            })
        });
    });
    describe('[GET] /employees', function(){
        it('It should get all employees', function(done){
            chai.request(app).get('/employees').end(function(err, res){
                should.not.exist(err);
                res.body.should.be.an('array');
                res.body.should.have.lengthOf(2);
                done();
            });
        });
        it('It should\'t get employees using wrong format query', function(done){
            chai.request(app).get('/employees?age=twenty').end(function(err, res){
                should.exist(err);
                expect(res).to.have.status(422);
                res.body[0].name.should.be.equal('age');
                done();
            });
        });
        it('It should get employees with matching query', function(done){
            chai.request(app).get('/employees?first_name=Jessica').end(function(err, res){
                should.not.exist(err);
                res.body.should.be.an('array');
                done();
            });
        });        
    });
    describe('[GET] /employees/:employeeId', function(){
        it('It should get an employee using its id', function(done){
            chai.request(app).get('/employees/1').end(function(err, res){
                should.not.exist(err);
                res.body.should.be.an('object');                
                done();
            });
        });
        it('It shouldn\'t get an employee using unsaved id', function(done){
            chai.request(app).get('/employees/3').end(function(err, res){
                should.exist(err);
                expect(res).to.have.status(404);
                done();
            });
        });
    });
    describe('[PUT] /employees/:employeeId', function(){
        it('it should update an employee by his id', function(done){
            chai.request(app).put('/employees/1').send(fixtures.put.employee).end(function(err, res){
                should.not.exist(err);
                res.body.id.should.to.equal('1');
                done();
            })
        });
        it('it should update an employee using his id and the same employeeId', function(done){
            chai.request(app).put('/employees/1').send(fixtures.put.employeeid).end(function(err, res){
                should.not.exist(err);
                res.body.id.should.to.equal('1');
                done();
            })
        });
        it('it shouldn\'t update an employee using a duplicated employeeId', function(done){
            chai.request(app).put('/employees/2').send(fixtures.put.employee).end(function(err, res){
                should.exist(err);
                expect(res).have.status(422);
                res.body.should.be.an('array');                
                done();
            })
        });
        it('it shouldn\'t update an employee using wrong unformated attributes', function(done){
            chai.request(app).put('/employees/2').send(fixtures.put.employeew).end(function(err, res){
                should.exist(err);
                expect(res).have.status(422);
                res.body[0].name.should.be.equal('age');
                done();
            })
        });
        it('it shouldn\'t put an employee using an invalid id', function(done){
            chai.request(app).put('/employees/6').send(fixtures.put.employee).end(function(err, res){
                should.exist(err);
                expect(res).to.have.status(404);
                done();
            });
        });        
    });
    describe('[DELETE] /employees/:employeeId', function(){
        it('it should delete an employee using its id', function(done){
            chai.request(app).delete('/employees/1').end(function(err, res){
                should.not.exist(err);
                res.body.should.be.an('object');                
                done();
            })
        });
        
        it('it shouldn\'t delete an employee using an unsaved id', function(done){
            chai.request(app).delete('/employees/5').end(function(err, res){
                should.exist(err);
                expect(res).to.have.status(404);
                done();
            })
        });
    });

})