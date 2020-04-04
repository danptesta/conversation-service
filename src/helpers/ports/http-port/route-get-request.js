const createQuery = require('../../queries/create-query');
const makeHttpSuccess = require('./http-success');
const makeHttpError = require('./http-error');

const {
  RequiredParameterError,
  InvalidPropertyError,
  EntityNotFoundError,
} = require('../../errors');

const makeRouteGetRequest = ({ entityName, appFindEntityById, appFindEntities }) => {
  const findEntityById = async (id) => {
    try {
      const result = await appFindEntityById(id);
      return makeHttpSuccess({ statusCode: 200, result });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        return makeHttpError({
          statusCode: 404,
          errorMessage: error.message,
        });
      }
      throw error;
    }
  };

  const createEntitiesResult = (result) => {
    const entitiesResult = {};
    entitiesResult[`${entityName}s`] = result;
    return entitiesResult;
  };

  const findEntities = async (queryParams) => {
    try {
      const query = createQuery(queryParams);
      const result = await appFindEntities(query);
      return makeHttpSuccess({
        statusCode: 200,
        result: createEntitiesResult(result),
      });
    } catch (error) {
      if (error instanceof RequiredParameterError
        || error instanceof InvalidPropertyError) {
        return makeHttpError({
          statusCode: 404,
          errorMessage: error.message,
        });
      }
      throw error;
    }
  };

  const routeGetRequest = async (httpRequest) => {
    const { id } = httpRequest.pathParams || {};
    if (id) {
      return findEntityById(id);
    }
    const queryParams = httpRequest.queryParams || {};
    return findEntities(queryParams);
  };

  return routeGetRequest;
};

module.exports = makeRouteGetRequest;
