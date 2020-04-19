/* eslint-disable prefer-arrow-callback,func-names,quote-props,
  class-methods-use-this,no-unused-expressions,global-require,
  no-restricted-syntax, no-await-in-loop */

const makeApp = require('../../../src/conversations/app');
const repositoryFixture = require('../fixtures/conversation-repo-fixture')();
const assertHttpResponse = require('../helpers/assert-http-response');
const makeErrorApp = require('./error-app');
const { createAddMutationCommand } = require('../fixtures/conversations-fixture');
const makeHttpPortHandler = require('../../../src/conversations/ports/conversations-http-port');

describe('conversations-http-port:', function () {
  let app;
  let handle;

  beforeEach(async function () {
    const repository = repositoryFixture.createMemoryRepo();
    app = makeApp({ repository });
    handle = makeHttpPortHandler({ app });
  });

  context('When instantiating the http port:', function () {
    it('should return a function', function () {
      handle.should.be.a('function');
    });
  });

  context('When the request has an unsupported resource:', function () {
    it('should return error', async function () {
      const response = await handle({
        path: '/unsupported',
      });

      assertHttpResponse({
        response,
        expectedStatusCode: 404,
        expectedBody: {
          ok: false,
          msg: 'resource not found',
        },
      });
    });
  });

  context('When the request has an unsupported method:', function () {
    const testUnsupportedMethod = async (method) => {
      const response = await handle({
        path: '/mutations',
        method,
      });

      assertHttpResponse({
        response,
        expectedStatusCode: 405,
        expectedBody: {
          ok: false,
          msg: `${method} method not allowed on mutations.`,
        },
        customMessage: `unsupported method: ${method}`,
      });
    };

    it('should return 405 error', async function () {
      const unsupportedMethods = ['GET', 'DELETE', 'PUT', 'PATCH'];
      for (const unsupportedMethod of unsupportedMethods) {
        await testUnsupportedMethod(unsupportedMethod);
      }
    });
  });

  describe('add mutation (POST):', function () {
    context('When the input format is invalid:', function () {
      it('should return error', async function () {
        const response = await handle({
          path: '/mutations',
          method: 'POST',
          body: JSON.stringify({ conversationId: null }),
        });

        assertHttpResponse({
          response,
          expectedStatusCode: 400,
          expectedBody: {
            ok: false,
            msg: 'invalid input',
          },
        });
      });
    });

    context('When the origin does not match any existing mutation state:', function () {
      it('should return error', async function () {
        const response = await handle({
          path: '/mutations',
          method: 'POST',
          body: JSON.stringify(createAddMutationCommand({ origin: { alice: 0, bob: 1 } })),
        });

        assertHttpResponse({
          response,
          expectedStatusCode: 400,
          expectedBody: {
            ok: false,
            msg: 'invalid origin',
          },
        });
      });
    });

    context('When the request is valid:', function () {
      it('should return 201 succss:', async function () {
        const response = await handle({
          path: '/mutations',
          method: 'POST',
          body: JSON.stringify(createAddMutationCommand({})),
        });

        assertHttpResponse({
          response,
          expectedStatusCode: 201,
          expectedBody: {
            ok: true,
            text: 'hello',
          },
        });
      });
    });

    context('When the app encounters an unexpected error when adding a mutation:', function () {
      it('should return error', async function () {
        app = makeErrorApp();
        handle = makeHttpPortHandler({ app });
        const response = await handle({
          path: '/mutations',
          method: 'POST',
          body: JSON.stringify(createAddMutationCommand({})),
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
