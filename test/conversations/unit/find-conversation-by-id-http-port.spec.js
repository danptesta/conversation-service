/* eslint-disable prefer-arrow-callback,func-names,quote-props,
  class-methods-use-this,no-unused-expressions,global-require,
  no-restricted-syntax, no-await-in-loop */

const { createAddMutationCommand } = require('../fixtures/conversations-fixture');
const makeApp = require('../../../src/conversations/app');
const repositoryFixture = require('../fixtures/conversation-repo-fixture')();
const assertHttpResponse = require('../helpers/assert-http-response');
const makeErrorApp = require('./error-app');
const makeHttpPortHandler = require('../../../src/conversations/ports/conversations-http-port');

describe('conversations-http-port:', function () {
  let app;
  let handle;

  beforeEach(async function () {
    const repository = repositoryFixture.createMemoryRepo();
    app = makeApp({ repository });
    handle = makeHttpPortHandler({ app });
  });

  context('When the request has an unsupported method:', function () {
    const testUnsupportedMethod = async (method) => {
      const response = await handle({
        path: '/conversations',
        method,
      });

      assertHttpResponse({
        response,
        expectedStatusCode: 405,
        expectedBody: {
          ok: false,
          msg: `${method} method not allowed on conversations.`,
        },
        customMessage: `unsupported method: ${method}`,
      });
    };

    it('should return error', async function () {
      const unsupportedMethods = ['POST', 'PUT', 'PATCH'];
      for (const unsupportedMethod of unsupportedMethods) {
        await testUnsupportedMethod(unsupportedMethod);
      }
    });
  });

  describe('find conversation by id (GET):', function () {
    context('When finding a conversation that does not exist:', function () {
      it('should return error', async function () {
        const response = await handle({
          path: '/conversations',
          method: 'GET',
          pathParams: {
            id: 'does_not_exist',
          },
        });

        assertHttpResponse({
          response,
          expectedStatusCode: 404,
          expectedBody: {
            ok: false,
            msg: 'conversation not found',
          },
        });
      });
    });

    context('When finding a conversation that exists:', function () {
      const transform = ({ conversationId, lastMutation, text }) => ({
        id: conversationId,
        lastMutation,
        text,
      });

      it('should return the conversations', async function () {
        const command = createAddMutationCommand({});
        const conversation = await app.addMutation(command);
        const expected = transform(conversation);

        const response = await handle({
          path: '/conversations',
          method: 'GET',
          pathParams: {
            id: command.conversationId,
          },
        });

        assertHttpResponse({
          response,
          expectedStatusCode: 200,
          expectedBody: {
            ok: true,
            ...expected,
          },
        });
      });
    });

    context('When the app encounters an unexpected error when finding a conversation:', function () {
      it('should return error', async function () {
        app = makeErrorApp();
        handle = makeHttpPortHandler({ app });
        const response = await handle({
          path: '/conversations',
          method: 'GET',
          pathParams: {
            id: 'any-id',
          },
        });

        assertHttpResponse({
          response,
          expectedStatusCode: 500,
          expectedBody: {
            ok: false,
            msg: 'unexpected system error occured, please try again.',
          },
        });
      });
    });
  });
});
