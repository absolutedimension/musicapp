'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Musictrack = mongoose.model('Musictrack'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  musictrack;

/**
 * Musictrack routes tests
 */
describe('Musictrack CRUD tests', function () {

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

    // Save a user to the test db and create new Musictrack
    user.save(function () {
      musictrack = {
        name: 'Musictrack name'
      };

      done();
    });
  });

  it('should be able to save a Musictrack if logged in', function (done) {
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

        // Save a new Musictrack
        agent.post('/api/musictracks')
          .send(musictrack)
          .expect(200)
          .end(function (musictrackSaveErr, musictrackSaveRes) {
            // Handle Musictrack save error
            if (musictrackSaveErr) {
              return done(musictrackSaveErr);
            }

            // Get a list of Musictracks
            agent.get('/api/musictracks')
              .end(function (musictracksGetErr, musictracksGetRes) {
                // Handle Musictracks save error
                if (musictracksGetErr) {
                  return done(musictracksGetErr);
                }

                // Get Musictracks list
                var musictracks = musictracksGetRes.body;

                // Set assertions
                (musictracks[0].user._id).should.equal(userId);
                (musictracks[0].name).should.match('Musictrack name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Musictrack if not logged in', function (done) {
    agent.post('/api/musictracks')
      .send(musictrack)
      .expect(403)
      .end(function (musictrackSaveErr, musictrackSaveRes) {
        // Call the assertion callback
        done(musictrackSaveErr);
      });
  });

  it('should not be able to save an Musictrack if no name is provided', function (done) {
    // Invalidate name field
    musictrack.name = '';

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

        // Save a new Musictrack
        agent.post('/api/musictracks')
          .send(musictrack)
          .expect(400)
          .end(function (musictrackSaveErr, musictrackSaveRes) {
            // Set message assertion
            (musictrackSaveRes.body.message).should.match('Please fill Musictrack name');

            // Handle Musictrack save error
            done(musictrackSaveErr);
          });
      });
  });

  it('should be able to update an Musictrack if signed in', function (done) {
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

        // Save a new Musictrack
        agent.post('/api/musictracks')
          .send(musictrack)
          .expect(200)
          .end(function (musictrackSaveErr, musictrackSaveRes) {
            // Handle Musictrack save error
            if (musictrackSaveErr) {
              return done(musictrackSaveErr);
            }

            // Update Musictrack name
            musictrack.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Musictrack
            agent.put('/api/musictracks/' + musictrackSaveRes.body._id)
              .send(musictrack)
              .expect(200)
              .end(function (musictrackUpdateErr, musictrackUpdateRes) {
                // Handle Musictrack update error
                if (musictrackUpdateErr) {
                  return done(musictrackUpdateErr);
                }

                // Set assertions
                (musictrackUpdateRes.body._id).should.equal(musictrackSaveRes.body._id);
                (musictrackUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Musictracks if not signed in', function (done) {
    // Create new Musictrack model instance
    var musictrackObj = new Musictrack(musictrack);

    // Save the musictrack
    musictrackObj.save(function () {
      // Request Musictracks
      request(app).get('/api/musictracks')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Musictrack if not signed in', function (done) {
    // Create new Musictrack model instance
    var musictrackObj = new Musictrack(musictrack);

    // Save the Musictrack
    musictrackObj.save(function () {
      request(app).get('/api/musictracks/' + musictrackObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', musictrack.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Musictrack with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/musictracks/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Musictrack is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Musictrack which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Musictrack
    request(app).get('/api/musictracks/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Musictrack with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Musictrack if signed in', function (done) {
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

        // Save a new Musictrack
        agent.post('/api/musictracks')
          .send(musictrack)
          .expect(200)
          .end(function (musictrackSaveErr, musictrackSaveRes) {
            // Handle Musictrack save error
            if (musictrackSaveErr) {
              return done(musictrackSaveErr);
            }

            // Delete an existing Musictrack
            agent.delete('/api/musictracks/' + musictrackSaveRes.body._id)
              .send(musictrack)
              .expect(200)
              .end(function (musictrackDeleteErr, musictrackDeleteRes) {
                // Handle musictrack error error
                if (musictrackDeleteErr) {
                  return done(musictrackDeleteErr);
                }

                // Set assertions
                (musictrackDeleteRes.body._id).should.equal(musictrackSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Musictrack if not signed in', function (done) {
    // Set Musictrack user
    musictrack.user = user;

    // Create new Musictrack model instance
    var musictrackObj = new Musictrack(musictrack);

    // Save the Musictrack
    musictrackObj.save(function () {
      // Try deleting Musictrack
      request(app).delete('/api/musictracks/' + musictrackObj._id)
        .expect(403)
        .end(function (musictrackDeleteErr, musictrackDeleteRes) {
          // Set message assertion
          (musictrackDeleteRes.body.message).should.match('User is not authorized');

          // Handle Musictrack error error
          done(musictrackDeleteErr);
        });

    });
  });

  it('should be able to get a single Musictrack that has an orphaned user reference', function (done) {
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

          // Save a new Musictrack
          agent.post('/api/musictracks')
            .send(musictrack)
            .expect(200)
            .end(function (musictrackSaveErr, musictrackSaveRes) {
              // Handle Musictrack save error
              if (musictrackSaveErr) {
                return done(musictrackSaveErr);
              }

              // Set assertions on new Musictrack
              (musictrackSaveRes.body.name).should.equal(musictrack.name);
              should.exist(musictrackSaveRes.body.user);
              should.equal(musictrackSaveRes.body.user._id, orphanId);

              // force the Musictrack to have an orphaned user reference
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

                    // Get the Musictrack
                    agent.get('/api/musictracks/' + musictrackSaveRes.body._id)
                      .expect(200)
                      .end(function (musictrackInfoErr, musictrackInfoRes) {
                        // Handle Musictrack error
                        if (musictrackInfoErr) {
                          return done(musictrackInfoErr);
                        }

                        // Set assertions
                        (musictrackInfoRes.body._id).should.equal(musictrackSaveRes.body._id);
                        (musictrackInfoRes.body.name).should.equal(musictrack.name);
                        should.equal(musictrackInfoRes.body.user, undefined);

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
      Musictrack.remove().exec(done);
    });
  });
});
