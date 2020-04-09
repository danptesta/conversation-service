const {
  makeHttpError,
  makeHttpSuccess,
} = require('./http-response');
const {
  InvalidInputError,
  InvalidPropertyError,
  ConversationNotFoundError,
} = require('../../../helpers/errors');

const makeConversationsHttpPortHandler = ({ app }) => {
  const addMutation = async (httpRequest) => {
    try {
      const body = httpRequest.body || null;
      const command = JSON.parse(body);
      const result = await app.addMutation(command);
      return makeHttpSuccess({
        statusCode: 201,
        result: {
          text: result.text,
        },
      });
    } catch (error) {
      if (error instanceof InvalidInputError
        || error instanceof InvalidPropertyError) {
        return makeHttpError({
          statusCode: 201,
          msg: error.message,
        });
      }
      throw error;
    }
  };

  const listConversations = async () => {
    const result = await app.listConversations();
    return makeHttpSuccess({
      statusCode: 200,
      result: { conversations: result },
    });
  };

  const findConversationById = async (id) => {
    try {
      const result = await app.findConversationById(id);
      return makeHttpSuccess({ statusCode: 200, result });
    } catch (error) {
      if (error instanceof ConversationNotFoundError) {
        return makeHttpError({
          statusCode: 200,
          msg: error.message,
        });
      }
      throw error;
    }
  };

  const getConversations = async (httpRequest) => {
    const { id } = httpRequest.pathParams || {};
    if (id) {
      return findConversationById(id);
    }
    return listConversations();
  };

  const removeConversation = async (httpRequest) => {
    try {
      const { id } = httpRequest.pathParams || {};
      await app.removeConversation(id);
      return makeHttpSuccess({
        statusCode: 204,
        result: { msg: 'conversation removed' },
      });
    } catch (error) {
      if (error instanceof ConversationNotFoundError) {
        return makeHttpError({
          statusCode: 204,
          msg: error.message,
        });
      }
      throw error;
    }
  };

  const routeMutationsRequest = async (httpRequest) => {
    switch (httpRequest.method) {
      case 'POST':
        return addMutation(httpRequest);
      default:
        return makeHttpError({
          statusCode: 405,
          msg: `${httpRequest.method} method not allowed on mutations.`,
        });
    }
  };

  const routeConversationsRequest = async (httpRequest) => {
    switch (httpRequest.method) {
      case 'GET':
        return getConversations(httpRequest);
      case 'DELETE':
        return removeConversation(httpRequest);
      default:
        return makeHttpError({
          statusCode: 405,
          msg: `${httpRequest.method} method not allowed on conversations.`,
        });
    }
  };

  const routeRequest = async (httpRequest) => {
    const { path } = httpRequest;

    if (path.indexOf('/mutations') !== -1) {
      return routeMutationsRequest(httpRequest);
    }

    if (path.indexOf('/conversations') !== -1) {
      return routeConversationsRequest(httpRequest);
    }

    return makeHttpError({
      statusCode: 404,
      msg: 'resource not found',
    });
  };

  const handle = async (httpRequest) => {
    try {
      return await routeRequest(httpRequest);
    } catch (error) {
      return makeHttpError({
        statusCode: 500,
        msg: 'unexpected system error occured, please try again.',
      });
    }
  };

  return handle;
};

module.exports = makeConversationsHttpPortHandler;
