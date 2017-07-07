'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Musicgenre = mongoose.model('Musicgenre'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Musicgenre
 */
exports.create = function(req, res) {
  var musicgenre = new Musicgenre(req.body);
  musicgenre.user = req.user;

  musicgenre.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var socketio = req.app.get('socketio'); // tacke out socket instance from the app container
      socketio.sockets.emit('musicgenre.created', musicgenre); // emit an event for all conn
      res.jsonp(musicgenre);
    }
  });
};

/**
 * Show the current Musicgenre
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var musicgenre = req.musicgenre ? req.musicgenre.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  musicgenre.isCurrentUserOwner = req.user && musicgenre.user && musicgenre.user._id.toString() === req.user._id.toString();

  res.jsonp(musicgenre);
};

/**
 * Update a Musicgenre
 */
exports.update = function(req, res) {
  var musicgenre = req.musicgenre;

  musicgenre = _.extend(musicgenre, req.body);

  musicgenre.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var socketio = req.app.get('socketio'); // tacke out socket instance from the app container
      socketio.sockets.emit('musicgenre.updated', musicgenre); // emit an event for all conn
      res.jsonp(musicgenre);
    }
  });
};

/**
 * Delete an Musicgenre
 */
exports.delete = function(req, res) {
  var musicgenre = req.musicgenre;

  musicgenre.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var socketio = req.app.get('socketio'); // tacking out socket instance from the app container
      socketio.sockets.emit('musicgenre.deleted', musicgenre); // emit an event for all conn
      res.jsonp(musicgenre);
    }
  });
};

/**
 * List of Musicgenres
 */

exports.list = function(req, res) {
  var url = req.url;
  Musicgenre.find().count().exec(function(err,response){
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
        var count = response;
        var perPage = 4;
        var pageNo = req.param('page') > 0 ? req.param('page') : 0;
        var page = parseInt(pageNo);
         var url = "http://35.185.87.223:8443/v1/genres?page=";
        var nextPage = url+(page+1);
        var prevPage = null;
        console.log("Pagination inputs :"+perPage,page,nextPage,prevPage);
        if(page-1 !== 0 && page !== 0){
          prevPage = url+(page-1);
        }
        Musicgenre.find().limit(perPage).skip(perPage * page).sort('-created').populate('genre').exec(function(err, musicgenres) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            var responseWithPage = {};
            responseWithPage.nextPage = nextPage;
            responseWithPage.prevPage = prevPage;
            responseWithPage.count = count;
            responseWithPage.results = musicgenres;
            res.jsonp(responseWithPage);
          }
        });
     }
  });
};

//  Musicgenre.find().exec(function(err, musicgenres) {
//     if (err) {
//       return res.status(400).send({
//         message: errorHandler.getErrorMessage(err)
//       });
//     } else {
//       responseObj.results = musicgenres;
//       Musicgenre.find().count().exec(function(err,musicgenre){
//         if (err) {
//           return res.status(400).send({
//             message: errorHandler.getErrorMessage(err)
//           });
//         } else {
//           responseObj.count = musicgenre;
//            res.jsonp(responseObj);
//         }
//       });   
//     }
//   });

/**
 * Musicgenre middleware
 */
exports.musicgenreByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Musicgenre is invalid'
    });
  }

  Musicgenre.findById(id).populate('user', 'displayName').exec(function (err, musicgenre) {
    if (err) {
      return next(err);
    } else if (!musicgenre) {
      return res.status(404).send({
        message: 'No Musicgenre with that identifier has been found'
      });
    }
    req.musicgenre = musicgenre;
    next();
  });
};
