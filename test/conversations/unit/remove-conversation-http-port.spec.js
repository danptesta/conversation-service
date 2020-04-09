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

  describe('remove conversation (DELETE):', function () {
    context('When removing a conversation that exists:', function () {
      it('should return success', async function () {
        const command = createAddMutationCommand({});
        await app.addMutation(command);

        const response = await handle({
          path: '/conversations',
          method: 'DELETE',
          pathParams: {
            id: command.conversationId,
          },
        });

        assertHttpResponse({
          response,
          expectedStatusCode: 204,
          expectedBody: {
            ok: true,
            msg: 'conversation removed',
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
