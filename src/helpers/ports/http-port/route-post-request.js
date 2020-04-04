const makeHttpSuccess = require('./http-success');
const makeHttpError = require('./http-error');

const {
  RequiredParameterError,
  InvalidPropertyError,
  UniqueConstraintError,
} = require('../../errors');

const makeRoutePostRequest = ({ appCreateEntity }) => {
  const createEntity = async (httpRequest) => {
    try {
      const body = httpRequest.body || null;
      const command = JSON.parse(body);
      const result = await appCreateEntity(command);
      return makeHttpSuccess({ statusCode: 201, result });
    } catch (error) {
      if (error instanceof RequiredParameterError
        || error instanceof InvalidPropertyError
        || error instanceof UniqueConstraintError) {
        return makeHttpError({
          statusCode: 400,
          errorMessage: error.message,
        });
      }
      throw error;
    }
  };

  const routePostRequest = async httpRequest => createEntity(httpRequest);

  return routePostRequest;
};

module.exports = makeRoutePostRequest;
