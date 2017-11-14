const fixtures = require('./offices.fixtures');

describe('officess', function(){
    describe('[POST] /officess', function(){
        it('Should create a new office', function(done){
            chai.request(app).post('/officess').send(fixtures.post.office).end(function(err, res){
                should.not.exist(err);
                should.exist(res);
                res.body.should.be.an('object');
                res.body.identifier.should.be.a('string');
                res.body.floor.should.be.a('number');
                done();
            })
        });
        it('It should\'t create a new office with duplicated identifier', function(done){
            chai.request(app).post('/officess').send(fixtures.post.office).end(function(err, res){
                should.exist(err);
                expect(res).to.have.status(422);
                res.body.should.be.an('array');
                res.body[0].message.should.be.a('string');
                res.body[0].name.should.be.equal('identifier');
                done();
            })
        });
        it('It should\'t create a new office without required attributes', function(done){
            chai.request(app).post('/officess').send(fixtures.post.officewrong).end(function(err,res){
                should.exist(err);
                expect(res).to.have.status(422);
                res.body.should.be.an('array'); 
                res.body[0].name.should.be.equal('identifier');
                done();
            })
        });
        it('It shouldn\'t create a new office with wrong attributes', function(done){
            chai.request(app).post('/officess').send(fixtures.post.officebad).end(function(err, res){
               should.exist(err);
               expect(res).to.have.status(422);
               res.body[0].name.should.be.equal('floor');
               done();
            })
        });
        it('It should create a new office with unrequired attributes', function(done){
            chai.request(app).post('/officess').send(fixtures.post.officegood).end(function(err, res){
                should.not.exist(err);
                expect(res.body.capacity).to.be.undefined;
                expect(res.body.area).to.be.undefined;
                done();
            })
        });
    });
    describe('[GET] /officess', function(){
        it('It should get all officess', function(done){
            chai.request(app).get('/officess').end(function(err, res){
                should.not.exist(err);
                res.body.should.be.an('array');
                res.body.should.have.lengthOf(2);
                done();
            });
        });
        it('It should\'t get officess using wrong format query', function(done){
            chai.request(app).get('/officess').send(fixtures.get.office).end(function(err, res){
                should.exist(err);
                expect(err).to.have.status(422);
                res.body[0].name.should.be.equal('identifier');
                done();
            })
        });
    });
})