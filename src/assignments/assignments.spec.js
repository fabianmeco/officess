const fixtures = require('./assignments.fixtures');

describe('assignments', function(){
    describe('[POST] /assignments', function(){
        it('Should create a new assignment', function(done){
            chai.request(app).post('/assignments').send(fixtures.post.assignment).end(function(err, res){
                should.not.exist(err);
                should.exist(res);
                res.body.should.be.an('object');
                res.body.employeeId.should.be.a('string');
                done();
            })
        });
        it('It should\'t create a new assignment with existing assignmentId', function(done){
            chai.request(app).post('/assignments').send(fixtures.post.assignment).end(function(err, res){
                should.exist(err);
                expect(res).to.have.status(422);
                res.body.should.be.an('array');
                res.body[0].message.should.be.a('string');
                res.body[0].name.should.be.equal('assignmentId');
                done();
            })
        });
        it('It should\'t create a new assignment without required attributes', function(done){
            chai.request(app).post('/assignments').send(fixtures.post.assignmentwrong).end(function(err,res){
                should.exist(err);
                expect(res).to.have.status(422);
                res.body.should.be.an('array'); 
                res.body[0].name.should.be.equal('assignmentId');
                done();
            })
        });
        it('It shouldn\'t create a new assignment with wrong attributes', function(done){
            chai.request(app).post('/assignments').send(fixtures.post.assignmentbad).end(function(err, res){
               should.exist(err);
               expect(res).to.have.status(422);
               res.body[0].name.should.be.equal('status');
               done();
            })
        });
        it('It should create a new assignment with unrequired attributes', function(done){
            chai.request(app).post('/assignments').send(fixtures.post.assignmentgood).end(function(err, res){
                should.not.exist(err);
                expect(res.body.description).to.be.undefined;
                done();
            })
        });
    });
    describe('[GET] /assignments', function(){
        it('It should get all assignments', function(done){
            chai.request(app).get('/assignments').end(function(err, res){
                should.not.exist(err);
                res.body.should.be.an('array');
                res.body.should.have.lengthOf(2);
                done();
            });
        });
        it('It should\'t get assignments using wrong format query', function(done){
            chai.request(app).get('/assignments?status=perro').end(function(err, res){
                should.exist(err);
                expect(res).to.have.status(422);
                res.body[0].name.should.be.equal('status');
                done();
            });
        });
        it('It should get assignments with matching query', function(done){
            chai.request(app).get('/assignments?assignmentId=tsk-123').end(function(err, res){
                should.not.exist(err);
                res.body.should.be.an('array');
                done();
            });
        });        
    });
    describe('[GET] /assignments/:id', function(){
        it('It should get an assignment using its id', function(done){
            chai.request(app).get('/assignments/1').end(function(err, res){
                should.not.exist(err);
                res.body.should.be.an('object');                
                done();
            });
        });
        it('It shouldn\'t get an assignment using unsaved id', function(done){
            chai.request(app).get('/assignments/3').end(function(err, res){
                should.exist(err);
                expect(res).to.have.status(404);
                done();
            });
        });
    });
    describe('[PUT] /assignments/:id', function(){
        it('it should update an assignment by his id', function(done){
            chai.request(app).put('/assignments/1').send(fixtures.put.assignment).end(function(err, res){
                should.not.exist(err);
                res.body.id.should.to.equal('1');
                done();
            })
        });
        it('it should update an assignment using his id and the same assignmentId', function(done){
            chai.request(app).put('/assignments/1').send(fixtures.put.assignmentid).end(function(err, res){
                should.not.exist(err);
                res.body.id.should.to.equal('1');
                done();
            })
        });
        it('it shouldn\'t update an assignment using a duplicated assignmentId', function(done){
            chai.request(app).put('/assignments/2').send(fixtures.put.assignment).end(function(err, res){
                should.exist(err);
                expect(res).have.status(422);
                res.body.should.be.an('array');                
                done();
            })
        });
        it('it shouldn\'t update an assignment using wrong unformated attributes', function(done){
            chai.request(app).put('/assignments/2').send(fixtures.put.assignmentwrong).end(function(err, res){
                should.exist(err);
                expect(res).have.status(422);
                res.body[0].name.should.be.equal('status');
                done();
            })
        });
        it('it shouldn\'t put an assignment using an invalid id', function(done){
            chai.request(app).put('/assignments/6').send(fixtures.put.assignment).end(function(err, res){
                should.exist(err);
                expect(res).to.have.status(404);
                done();
            });
        });        
    });
    describe('[DELETE] /assignments/:id', function(){
        it('it should delete an assignment using its id', function(done){
            chai.request(app).delete('/assignments/1').end(function(err, res){
                should.not.exist(err);
                res.body.should.be.an('object');                
                done();
            })
        });
        
        it('it shouldn\'t delete an assignment using an unsaved id', function(done){
            chai.request(app).delete('/assignments/5').end(function(err, res){
                should.exist(err);
                expect(res).to.have.status(404);
                done();
            })
        });
    });

})