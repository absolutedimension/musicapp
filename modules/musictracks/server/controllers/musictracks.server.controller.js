'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Musictrack = mongoose.model('Musictrack'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

  var config = require(path.resolve('./config/config'));



/**
 * Create a Musictrack
 */
exports.create = function(req, res) {
  var musictrack = new Musictrack(req.body);
  musictrack.user = req.user;

  musictrack.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var socketio = req.app.get('socketio'); // taking out socket instance from the app container
      socketio.sockets.emit('musictrack.created', musictrack); // emit an event for all conn
      res.jsonp(musictrack);
    }
  });
};

/**
 * Show the current Musictrack
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var musictrack = req.musictrack ? req.musictrack.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  musictrack.isCurrentUserOwner = req.user && musictrack.user && musictrack.user.toString() === req.user._id.toString();

  res.jsonp(musictrack);
};

exports.viewTrack = function(req,res,next,id){
    Musictrack.findOne({_id:id}).populate('genre').exec(function(err,response){
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        var track = {}
        track.next = null;
        track.previous = null;
        track.count = 1;
        track.results = [response];
        res.jsonp(track);
      }
    });
}

/**
 * Update a Musictrack
 */
exports.update = function(req, res) {
  var musictrack = req.musictrack;

  musictrack = _.extend(musictrack, req.body);

  musictrack.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var socketio = req.app.get('socketio'); // taking out socket instance from the app container
      socketio.sockets.emit('musictrack.updated', musictrack); // emit an event for all conn
      res.jsonp(musictrack);
    }
  });
};

/**
 * Delete an Musictrack
 */
exports.delete = function(req, res) {
  var musictrack = req.musictrack;

  musictrack.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var socketio = req.app.get('socketio'); // taking out socket instance from the app container
      socketio.sockets.emit('musictrack.deleted', musictrack);
      // emit an event for all conn
      res.jsonp(musictrack);
    }
  });
};

/**
 * List of Musictracks
 */

// exports.list = function(req, res) {
//    var perPage = 4;
//    var pageNo = req.param('page') > 0 ? req.param('page') : 0;
//    var page = parseInt(pageNo);
//    var nextPage = "http://localhost:3000/api/musicgenres?page="+(page+1);
//    var prevPage = null;
//    console.log("Pagination inputs :"+perPage,page,nextPage,prevPage);
//    if(page-1 !== 0){
//      prevPage = "http://localhost:3000/api/musicgenres?page="+(page-1);
//    }
//    Musictrack.aggregate([
//      {$group:{_id:null,count:{$sum:1},results:{$push:"$$ROOT"}}},
//      {$limit:3}
//             //  {$skip:perPage*page},
//             //  {$sort:{created:-1}}
//              ]).exec(function(err, musictracks) {
//     if (err) {
//       return res.status(400).send({
//         message: errorHandler.getErrorMessage(err)
//       });
//     } else {
//       var responseWithPage = {};
//       responseWithPage.nextPage = nextPage;
//       responseWithPage.prevPage = prevPage;
//      // responseWithPage.count = musictracks[0].count;
//      // responseWithPage.results = musictracks[0].results;
//       res.jsonp(musictracks);
//     }
//   });
// };

exports.list = function(req, res) {
  Musictrack.find().count().exec(function(err,response){
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
        var count = response;
        var perPage = 4;
        var pageNo = req.param('page') > 0 ? req.param('page') : 0;
        var page = parseInt(pageNo);
        var url = "http://52.187.59.50:8443/v1/tracks?page=";
        var nextPage = url+(page+1);
        var prevPage = null;
        if(page-1 !== 0 && page !== 0){
          prevPage = url+(page-1);
        }
       Musictrack.find().sort('-created').limit(perPage).skip(perPage * (page-1)).populate('genre').exec(function(err, musictracks) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            var responseWithPage = {};
            responseWithPage.nextPage = nextPage;
            responseWithPage.prevPage = prevPage;
            responseWithPage.count = count;
            responseWithPage.results = musictracks;
            res.jsonp(responseWithPage);
          }
        });
     }
  });
};

exports.musictrackByTitle = function(req,res) {
     var titleToSearch = req.param('title');
     console.log("Search By Title :"+titleToSearch);
     Musictrack.find({title:titleToSearch}).count().exec(function(err,response){
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
        var count = response;
        Musictrack.find({title:titleToSearch}).sort('-created').populate('genre').exec(function(err, musictracks) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            var searchResponse = {};
            searchResponse.nextPage = null;
            searchResponse.prevPage = null;
            searchResponse.count = count;
            searchResponse.results = musictracks;
            res.jsonp(searchResponse);
          }
        });
     }
  });
}

/**
 * Musictrack middleware
 */
exports.musictrackByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Musictrack is invalid'
    });
  }

  Musictrack.findById(id).populate('genre').exec(function (err, musictrack) {
    if (err) {
      return next(err);
    } else if (!musictrack) {
      return res.status(404).send({
        message: 'No Musictrack with that identifier has been found'
      });
    }
    req.musictrack = musictrack;
    next();
  });
};
