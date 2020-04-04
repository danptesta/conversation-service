const { logResponse } = require('../log-utils');

const makeLambdaHttpAdapter = ({ service, handleHttpPort }) => {
  const adaptLambdaEventToHttpRequest = (event = {}) => Object.freeze({
    path: event.path,
    method: event.httpMethod,
    pathParams: event.pathParameters,
    queryParams: event.queryStringParameters,
    body: event.body,
  });

  const handleLambdaEvent = async (event) => {
    const httpRequest = adaptLambdaEventToHttpRequest(event);
    const startTime = Date.now();
    const httpResponse = await handleHttpPort(httpRequest);

    logResponse({
      service,
      port: `${service}s-http`,
      adapter: 'lambda',
      method: 'handleLambdaEvent',
      startTime,
      request: httpRequest,
      response: httpResponse,
      logLevel: 'info',
    });

    return httpResponse;
  };

  return handleLambdaEvent;
};

module.exports = makeLambdaHttpAdapter;
