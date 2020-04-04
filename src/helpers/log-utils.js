const logger = require('./logger');

const createResponseLog = ({
  service, port, adapter, method, startTime, request, response, ...otherInfo
}) => ({
  service,
  port,
  adapter,
  message: {
    method,
    duration: Date.now() - startTime,
    request,
    response,
    ...otherInfo,
  },
});

const logResponse = ({
  service, port, adapter, method, startTime, request, response, logLevel, ...otherInfo
}) => {
  if (logLevel === 'debug') {
    logger.debug(createResponseLog({
      service, port, adapter, method, startTime, request, response, ...otherInfo,
    }));
  } else {
    logger.info(createResponseLog({
      service, port, adapter, method, startTime, request, response, ...otherInfo,
    }));
  }
};

const logError = ({
  service, port, adapter, method, startTime, request, error, ...otherInfo
}) => {
  logger.error({
    service,
    port,
    adapter,
    message: {
      method,
      duration: Date.now() - startTime,
      request,
      error,
      ...otherInfo,
    },
  });
};

module.exports = { logResponse, logError };
