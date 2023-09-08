'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

var BlogItemSchema = Schema({
  card_title: String,
  card_text: String,
  card_picture: String,
  title: String,
  content: String,
  tag: String,
  date: Date,
  userId: { type: ObjectId, ref: 'user' },
  username: String
});

module.exports = mongoose.model('BlogItems', BlogItemSchema);
