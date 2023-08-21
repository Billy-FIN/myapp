'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var NotesItemSchema = Schema({
  title: String,
  category: String,
  tag: String,
  details: String,
  username: String,
  date: Date,
});

module.exports = mongoose.model('NotesItems', NotesItemSchema);
