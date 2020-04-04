const makeHttpSuccess = require('./http-success');
const makeHttpError = require('./http-error');

const {
  RequiredParameterError,
  InvalidPropertyError,
  EntityNotFoundError,
} = require('../../errors');

const makeRoutePatchRequest = ({ handleActions }) => {
  const handleActionError = (error) => {
    if (error instanceof RequiredParameterError
      || error instanceof InvalidPropertyError) {
      return makeHttpError({
        statusCode: 400,
        errorMessage: error.message,
      });
    }
    if (error instanceof EntityNotFoundError) {
      return makeHttpError({
        statusCode: 404,
        errorMessage: error.message,
      });
    }
    throw error;
  };

  const routeAction = async ({ action, id, body }) => {
    try {
      let result;
      const handleAction = handleActions[action];

      if (handleAction) {
        result = await handleAction({ id, ...body.params });
        return makeHttpSuccess({ statusCode: 200, result });
      }

      return makeHttpError({
        statusCode: 400,
        errorMessage: `${action} action is not allowed.`,
      });
    } catch (error) {
      return handleActionError(error);
    }
  };

  const routePatchRequest = async (httpRequest) => {
    const body = JSON.parse(httpRequest.body || null) || {};
    const { action } = body;
    const { id } = httpRequest.pathParams || {};

    if (action) return routeAction({ action, id, body });

    return makeHttpError({
      statusCode: 400,
      errorMessage: 'Missing required fields: action',
    });
  };

  return routePatchRequest;
};

module.exports = makeRoutePatchRequest;
