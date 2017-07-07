'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

//var Musicgenre = mongoose.model('Musicgenre');

/**
 * Musictrack Schema
 */
var MusictrackSchema = new Schema({
  title: {
    type: String,
    default: '',
    required: 'Please fill Musictrack title',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  genre:{
    type:[{type:Schema.ObjectId,ref:'Musicgenre'}]
  },
  rating:{
    type:Number
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

//mongoose.model('Musictrack', MusictrackSchema);
mongoose.model('Musictrack', MusictrackSchema);
