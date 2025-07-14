// src/middleware/logger.js
const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '../../logs.txt');

const logger = (req, res, next) => {
  const log = `${new Date().toISOString()} - ${req.method} ${req.originalUrl}\n`;
  fs.appendFile(logFile, log, (err) => {
    if (err) console.error("Log write error");
  });
  next();
};

module.exports = logger;
