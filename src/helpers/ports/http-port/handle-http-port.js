const makeHttpError = require('./http-error');

const makeHandleHttpPort = (routers) => {
  const routeRequest = async (httpRequest) => {
    const routeRequestByHttpMethod = routers[httpRequest.method];

    if (routeRequestByHttpMethod) return routeRequestByHttpMethod(httpRequest);

    return makeHttpError({
      statusCode: 405,
      errorMessage: `${httpRequest.method} method not allowed.`,
    });
  };

  const handleHttpPort = async (httpRequest) => {
    try {
      return await routeRequest(httpRequest);
    } catch (error) {
      return makeHttpError({
        statusCode: 500,
        errorMessage: 'unexpected system error occured, please try again.',
      });
    }
  };

  return handleHttpPort;
};

module.exports = makeHandleHttpPort;
