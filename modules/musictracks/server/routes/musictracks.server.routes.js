'use strict';

/**
 * Module dependencies
 */
var musictracksPolicy = require('../policies/musictracks.server.policy'),
  musictracks = require('../controllers/musictracks.server.controller');

module.exports = function(app) {
  // Musictracks Routes
  app.route('/v1/tracks').all(musictracksPolicy.isAllowed)
    .get(musictracks.list)
    .post(musictracks.create);

  app.route('/v1/tracks/:musictrackId').all(musictracksPolicy.isAllowed)
    .get(musictracks.read)
    .put(musictracks.update)
    .delete(musictracks.delete);
  
  app.route('/v1/searchtracks')
    .get(musictracks.musictrackByTitle);
  
  // Finish by binding the Musictrack middleware
  app.param('musictrackId', musictracks.musictrackByID);
};
