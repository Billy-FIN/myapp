'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

var BlogItemSchema = Schema({
  title: String,
  subtitle: String,
  tag: String,
  date: Date,
  display: Boolean,
  userId: { type: ObjectId, ref: 'user' },
  username: String
});

module.exports = mongoose.model('BlogItems', BlogItemSchema);
