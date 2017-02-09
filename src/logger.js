var winston = require('winston');
var fs = require('fs-extra');
var _ = require('lodash');

fs.ensureDirSync('logs');
var logger = new(winston.Logger)({
  level: 'debug',
  transports: [
    new(winston.transports.Console)({
      level: process.env.CONSOLE_LOG_LEVEL || 'debug',
      colorize: true,
      json: false,
      prettyPrint: true
    })
  ]
});
var requestLogger = new(winston.Logger)({
  level: 'debug',
  transports: [
    new(winston.transports.Console)({
      level: process.env.CONSOLE_LOG_LEVEL || 'debug',
      colorize: true,
      json: false
    })
  ]
});
logger.handleExceptions();
logger.exitOnError = false;
module.exports = {
  log: logger.debug,
  debug: logger.debug,
  info: logger.info,
  warn: logger.warn,
  error: logger.error,
  err: logger.error,
  requests: {
    write: (message, encoding) => requestLogger.info(message)
  }
}
