const fixtures = require('./offices.fixtures');

describe('offices', function(){
    describe('[POST] /offices', function(){
        it('Should create a new office', function(done){
            chai.request(app).post('/offices').send(fixtures.post.office).end(function(err, res){
                should.not.exist(err);
                should.exist(res);
                res.body.should.be.an('object');
                res.body.identifier.should.be.a('string');
                res.body.floor.should.be.a('number');
                done();
            })
        });
        it('It should\'t create a new office with duplicated identifier', function(done){
            chai.request(app).post('/offices').send(fixtures.post.office).end(function(err, res){
                should.exist(err);
                expect(res).to.have.status(422);
                res.body.should.be.an('array');
                res.body[0].message.should.be.a('string');
                res.body[0].name.should.be.equal('identifier');
                done();
            })
        });
        it('It should\'t create a new office without required attributes', function(done){
            chai.request(app).post('/offices').send(fixtures.post.officewrong).end(function(err,res){
                should.exist(err);
                expect(res).to.have.status(422);
                res.body.should.be.an('array'); 
                res.body[0].name.should.be.equal('identifier');
                done();
            })
        });
        it('It shouldn\'t create a new office with wrong attributes', function(done){
            chai.request(app).post('/offices').send(fixtures.post.officebad).end(function(err, res){
               should.exist(err);
               expect(res).to.have.status(422);
               res.body[0].name.should.be.equal('floor');
               done();
            })
        });
        it('It should create a new office with unrequired attributes', function(done){
            chai.request(app).post('/offices').send(fixtures.post.officegood).end(function(err, res){
                should.not.exist(err);
                expect(res.body.capacity).to.be.undefined;
                expect(res.body.area).to.be.undefined;
                done();
            })
        });
    });
    describe('[GET] /offices', function(){
        it('It should get all offices', function(done){
            chai.request(app).get('/offices').end(function(err, res){
                should.not.exist(err);
                res.body.should.be.an('array');
                res.body.should.have.lengthOf(2);
                done();
            });
        });
        it('It should\'t get offices using wrong format query', function(done){
            chai.request(app).get('/offices?floor=bad').end(function(err, res){
                should.exist(err);
                expect(res).to.have.status(422);
                res.body[0].name.should.be.equal('floor');
                done();
            });
        });
        it('It should get offices with matching query', function(done){
            chai.request(app).get('/offices?building=UTA').end(function(err, res){
                should.not.exist(err);
                res.body.should.be.an('array');
                done();
            });
        });        
    });
    describe('[GET] /offices/:id', function(){
        it('It should get an office using its id', function(done){
            chai.request(app).get('/offices/1').end(function(err, res){
                should.not.exist(err);
                res.body.should.be.an('object');                
                done();
            });
        });
        it('It shouldn\'t get an office using unsaved id', function(done){
            chai.request(app).get('/offices/666').end(function(err, res){
                should.exist(err);
                expect(res).to.have.status(404);
                done();
            });
        });
    });
    describe('[PUT] /offices/:id', function(){
        it('it should update an office by his id', function(done){
            chai.request(app).put('/offices/1').send(fixtures.put.office).end(function(err, res){
                should.not.exist(err);
                res.body.id.should.to.equal('1');
                res.body.building.should.have.lengthOf(fixtures.put.office.building.length);
                done();
            })
        });
        it('it should update an office using his id and the same identifier', function(done){
            chai.request(app).put('/offices/1').send(fixtures.put.officeidentifier).end(function(err, res){
                should.not.exist(err);
                res.body.id.should.to.equal('1');
                done();
            })
        });
        it('it shouldn\'t update an office using a duplicated identifier', function(done){
            chai.request(app).put('/offices/2').send(fixtures.put.office).end(function(err, res){
                should.exist(err);
                expect(res).have.status(422);
                res.body.should.be.an('object');
                res.body.name.should.be.equal('identifier');
                done();
            })
        });
        it('it shouldn\'t update an office using wrong unformated attributes', function(done){
            chai.request(app).put('/offices/2').send(fixtures.put.officewrong).end(function(err, res){
                should.exist(err);
                expect(res).have.status(422);
                res.body[0].name.should.be.equal('floor');
                done();
            })
        });
        it('it shouldn\'t put an office using an invalid id', function(done){
            chai.request(app).put('/offices/6').send(fixtures.put.office).end(function(err, res){
                should.exist(err);
                expect(res).to.have.status(404);
                done();
            });
        });        
    });
    describe('[DELETE] /offices/:id', function(){
        it('it should delete an office using its id', function(done){
            chai.request(app).delete('/offices/1').end(function(err, res){
                should.not.exist(err);
                res.body.should.be.an('object');
                res.body.should.not.be.an('array');
                done();
            })
        });
        
        it('it shouldn\'t delete an office using an unsaved id', function(done){
            chai.request(app).delete('/offices/5').end(function(err, res){
                should.exist(err);
                expect(res).to.have.status(404);
                done();
            })
        });
    });

})