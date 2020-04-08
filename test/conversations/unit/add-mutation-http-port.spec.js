/* eslint-disable prefer-arrow-callback,func-names,quote-props,
  class-methods-use-this,no-unused-expressions,global-require,
  no-restricted-syntax, no-await-in-loop */

const makeApp = require('../../../src/conversations/app');
const repositoryFixture = require('../fixtures/conversation-repo-fixture')();
const assertHttpResponse = require('../helpers/assert-http-response');
const makeErrorApp = require('./error-app');
const { createAddMutationCommand } = require('../fixtures/conversations-fixture');
const makeHttpPortHandler = require('../../../src/conversations/ports/conversations-http-port');

describe('data-items-http-port (create data item):', function () {
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
    it('should return 404 error', async function () {
      const response = await handle({
        path: '/unsupported',
      });

      assertHttpResponse({
        response,
        expectedStatusCode: 404,
        expectedBody: {
          msg: 'resource not found',
          ok: false,
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
          msg: `${method} method not allowed on mutations.`,
          ok: false,
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
      it('should return 400 error', async function () {
        const response = await handle({
          path: '/mutations',
          method: 'POST',
          body: JSON.stringify({ conversationId: null }),
        });

        assertHttpResponse({
          response,
          expectedStatusCode: 201,
          expectedBody: {
            msg: 'invalid input',
            ok: false,
          },
        });
      });
    });

    context('When the origin does not match current state:', function () {
      it('should return 400 error', async function () {
        const response = await handle({
          path: '/mutations',
          method: 'POST',
          body: JSON.stringify(createAddMutationCommand({ origin: { alice: 0, bob: 1 } })),
        });

        assertHttpResponse({
          response,
          expectedStatusCode: 201,
          expectedBody: {
            msg: 'origin does not match current state',
            ok: false,
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
      it('should return 500 error', async function () {
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
            msg: 'unexpected system error occured, please try again.',
            ok: false,
          },
        });
      });
    });
  });
});
