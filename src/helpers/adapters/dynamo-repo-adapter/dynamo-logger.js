const { logResponse, logError } = require('../../../helpers/log-utils');

const makeDynamoLogger = ({ service, port, logLevel = 'debug' }) => {
  const logDynamoResponse = ({
    method, startTime, params, response,
  }) => {
    logResponse({
      service, port, adapter: 'dynamo', method, startTime, request: params, response, logLevel,
    });
  };

  const logDynamoError = ({
    method, startTime, params, error,
  }) => {
    logError({
      service, port, adapter: 'dynamo', method, startTime, request: params, error,
    });
  };

  return Object.freeze({ logDynamoResponse, logDynamoError });
};

module.exports = makeDynamoLogger;
