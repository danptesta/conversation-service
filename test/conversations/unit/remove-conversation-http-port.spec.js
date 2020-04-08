/* eslint-disable prefer-arrow-callback,func-names,quote-props,
  class-methods-use-this,no-unused-expressions,global-require,
  no-restricted-syntax, no-await-in-loop */

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

  describe('remove conversation (DELETE):', function () {
    context('When removing a conversation that does not exist:', function () {
      it('should return error', async function () {
        const response = await handle({
          path: '/conversations',
          method: 'DELETE',
          pathParams: {
            id: 'does_not_exist',
          },
        });

        assertHttpResponse({
          response,
          expectedStatusCode: 204,
          expectedBody: {
            ok: false,
            msg: 'conversation not found',
          },
        });
      });
    });

    context('When removing a conversation that exists:', function () {
      const createConversation = async conversationId => app.addMutation({
        author: 'bob',
        conversationId,
        data: {
          index: 0,
          text: `This is conversation ${conversationId}`,
          type: 'insert',
        },
        origin: { alice: 0, bob: 0 },
      });

      it('should return success', async function () {
        const removeId = 'remove-conversation';
        await createConversation(removeId);

        const response = await handle({
          path: '/conversations',
          method: 'DELETE',
          pathParams: {
            id: removeId,
          },
        });

        assertHttpResponse({
          response,
          expectedStatusCode: 204,
          expectedBody: {
            ok: true,
          },
        });
      });
    });

    context('When the app encounters an unexpected error when removing a conversation:', function () {
      it('should return error', async function () {
        app = makeErrorApp();
        handle = makeHttpPortHandler({ app });
        const response = await handle({
          path: '/conversations',
          method: 'DELETE',
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
