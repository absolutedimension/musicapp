'use strict';

/**
 * Module dependencies
 */
var musicgenresPolicy = require('../policies/musicgenres.server.policy'),
  musicgenres = require('../controllers/musicgenres.server.controller');

module.exports = function(app) {
  // Musicgenres Routes
  app.route('/v1/genres').all(musicgenresPolicy.isAllowed)
    .get(musicgenres.list)
    .post(musicgenres.create);

  app.route('/v1/genres/:musicgenreId').all(musicgenresPolicy.isAllowed)
    .get(musicgenres.read)
    .put(musicgenres.update)
    .delete(musicgenres.delete);

  
   app.route('/v1/allgenre')
    .get(musicgenres.getAllGenreList);

  // Finish by binding the Musicgenre middleware
  app.param('musicgenreId', musicgenres.musicgenreByID);
};
