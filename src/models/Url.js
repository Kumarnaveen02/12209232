// src/models/Url.js
const mongoose = require('mongoose');

const clickSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  referrer: String,
  location: String
});

const urlSchema = new mongoose.Schema({
  shortCode: { type: String, unique: true },
  longUrl: String,
  createdAt: { type: Date, default: Date.now },
  expiresAt: Date,
  clickCount: { type: Number, default: 0 },
  clickData: [clickSchema]
});

module.exports = mongoose.model('Url', urlSchema);
