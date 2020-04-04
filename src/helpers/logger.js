const {
  createLogger,
  format,
  transports,
} = require('winston');

const {
  combine,
  json,
  splat,
  timestamp,
} = format;

const logLevel = process.env.LOG_LEVEL || 'info';
const logger = createLogger({
  level: process.env.NODE_DEBUG ? 'debug' : logLevel,
  format: combine(
    timestamp(),
    splat(),
    json()
  ),
  transports: [new transports.Console()],
});

module.exports = logger;
