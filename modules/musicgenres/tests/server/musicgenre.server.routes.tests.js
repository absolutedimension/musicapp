'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Musicgenre = mongoose.model('Musicgenre'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  musicgenre;

/**
 * Musicgenre routes tests
 */
describe('Musicgenre CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Musicgenre
    user.save(function () {
      musicgenre = {
        name: 'Musicgenre name'
      };

      done();
    });
  });

  it('should be able to save a Musicgenre if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Musicgenre
        agent.post('/api/musicgenres')
          .send(musicgenre)
          .expect(200)
          .end(function (musicgenreSaveErr, musicgenreSaveRes) {
            // Handle Musicgenre save error
            if (musicgenreSaveErr) {
              return done(musicgenreSaveErr);
            }

            // Get a list of Musicgenres
            agent.get('/api/musicgenres')
              .end(function (musicgenresGetErr, musicgenresGetRes) {
                // Handle Musicgenres save error
                if (musicgenresGetErr) {
                  return done(musicgenresGetErr);
                }

                // Get Musicgenres list
                var musicgenres = musicgenresGetRes.body;

                // Set assertions
                (musicgenres[0].user._id).should.equal(userId);
                (musicgenres[0].name).should.match('Musicgenre name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Musicgenre if not logged in', function (done) {
    agent.post('/api/musicgenres')
      .send(musicgenre)
      .expect(403)
      .end(function (musicgenreSaveErr, musicgenreSaveRes) {
        // Call the assertion callback
        done(musicgenreSaveErr);
      });
  });

  it('should not be able to save an Musicgenre if no name is provided', function (done) {
    // Invalidate name field
    musicgenre.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Musicgenre
        agent.post('/api/musicgenres')
          .send(musicgenre)
          .expect(400)
          .end(function (musicgenreSaveErr, musicgenreSaveRes) {
            // Set message assertion
            (musicgenreSaveRes.body.message).should.match('Please fill Musicgenre name');

            // Handle Musicgenre save error
            done(musicgenreSaveErr);
          });
      });
  });

  it('should be able to update an Musicgenre if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Musicgenre
        agent.post('/api/musicgenres')
          .send(musicgenre)
          .expect(200)
          .end(function (musicgenreSaveErr, musicgenreSaveRes) {
            // Handle Musicgenre save error
            if (musicgenreSaveErr) {
              return done(musicgenreSaveErr);
            }

            // Update Musicgenre name
            musicgenre.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Musicgenre
            agent.put('/api/musicgenres/' + musicgenreSaveRes.body._id)
              .send(musicgenre)
              .expect(200)
              .end(function (musicgenreUpdateErr, musicgenreUpdateRes) {
                // Handle Musicgenre update error
                if (musicgenreUpdateErr) {
                  return done(musicgenreUpdateErr);
                }

                // Set assertions
                (musicgenreUpdateRes.body._id).should.equal(musicgenreSaveRes.body._id);
                (musicgenreUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Musicgenres if not signed in', function (done) {
    // Create new Musicgenre model instance
    var musicgenreObj = new Musicgenre(musicgenre);

    // Save the musicgenre
    musicgenreObj.save(function () {
      // Request Musicgenres
      request(app).get('/api/musicgenres')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Musicgenre if not signed in', function (done) {
    // Create new Musicgenre model instance
    var musicgenreObj = new Musicgenre(musicgenre);

    // Save the Musicgenre
    musicgenreObj.save(function () {
      request(app).get('/api/musicgenres/' + musicgenreObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', musicgenre.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Musicgenre with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/musicgenres/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Musicgenre is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Musicgenre which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Musicgenre
    request(app).get('/api/musicgenres/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Musicgenre with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Musicgenre if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Musicgenre
        agent.post('/api/musicgenres')
          .send(musicgenre)
          .expect(200)
          .end(function (musicgenreSaveErr, musicgenreSaveRes) {
            // Handle Musicgenre save error
            if (musicgenreSaveErr) {
              return done(musicgenreSaveErr);
            }

            // Delete an existing Musicgenre
            agent.delete('/api/musicgenres/' + musicgenreSaveRes.body._id)
              .send(musicgenre)
              .expect(200)
              .end(function (musicgenreDeleteErr, musicgenreDeleteRes) {
                // Handle musicgenre error error
                if (musicgenreDeleteErr) {
                  return done(musicgenreDeleteErr);
                }

                // Set assertions
                (musicgenreDeleteRes.body._id).should.equal(musicgenreSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Musicgenre if not signed in', function (done) {
    // Set Musicgenre user
    musicgenre.user = user;

    // Create new Musicgenre model instance
    var musicgenreObj = new Musicgenre(musicgenre);

    // Save the Musicgenre
    musicgenreObj.save(function () {
      // Try deleting Musicgenre
      request(app).delete('/api/musicgenres/' + musicgenreObj._id)
        .expect(403)
        .end(function (musicgenreDeleteErr, musicgenreDeleteRes) {
          // Set message assertion
          (musicgenreDeleteRes.body.message).should.match('User is not authorized');

          // Handle Musicgenre error error
          done(musicgenreDeleteErr);
        });

    });
  });

  it('should be able to get a single Musicgenre that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Musicgenre
          agent.post('/api/musicgenres')
            .send(musicgenre)
            .expect(200)
            .end(function (musicgenreSaveErr, musicgenreSaveRes) {
              // Handle Musicgenre save error
              if (musicgenreSaveErr) {
                return done(musicgenreSaveErr);
              }

              // Set assertions on new Musicgenre
              (musicgenreSaveRes.body.name).should.equal(musicgenre.name);
              should.exist(musicgenreSaveRes.body.user);
              should.equal(musicgenreSaveRes.body.user._id, orphanId);

              // force the Musicgenre to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Musicgenre
                    agent.get('/api/musicgenres/' + musicgenreSaveRes.body._id)
                      .expect(200)
                      .end(function (musicgenreInfoErr, musicgenreInfoRes) {
                        // Handle Musicgenre error
                        if (musicgenreInfoErr) {
                          return done(musicgenreInfoErr);
                        }

                        // Set assertions
                        (musicgenreInfoRes.body._id).should.equal(musicgenreSaveRes.body._id);
                        (musicgenreInfoRes.body.name).should.equal(musicgenre.name);
                        should.equal(musicgenreInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Musicgenre.remove().exec(done);
    });
  });
});
