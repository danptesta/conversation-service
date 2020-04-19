/* eslint-disable prefer-arrow-callback,func-names,quote-props,
  class-methods-use-this,no-unused-expressions,global-require,
  no-restricted-syntax, no-await-in-loop */

const { createAddMutationCommand } = require('../fixtures/conversations-fixture');
const makeApp = require('../../../src/conversations/app');
const repositoryFixture = require('../fixtures/mutation-repo-fixture')();
const assertHttpResponse = require('../helpers/assert-http-response');
const makeHttpPortHandler = require('../../../src/conversations/ports/conversations-http-port');

describe('conversations-http-port:', function () {
  let app;
  let handle;

  beforeEach(async function () {
    const repository = repositoryFixture.createMemoryRepo();
    app = makeApp({ repository });
    handle = makeHttpPortHandler({ app });
  });

  describe('list conversations (GET):', function () {
    context('When no conversations exist:', function () {
      it('should return success with empty array', async function () {
        const response = await handle({
          path: '/conversations',
          method: 'GET',
        });

        assertHttpResponse({
          response,
          expectedStatusCode: 200,
          expectedBody: {
            ok: true,
            conversations: [],
          },
        });
      });
    });

    context('When conversations exist:', function () {
      const transform = ({ conversationId, lastMutation, text }) => ({
        id: conversationId,
        lastMutation,
        text,
      });

      it('should return the conversations', async function () {
        const conversation1 = await app.addMutation(createAddMutationCommand({}));
        const conversation2 = await app.addMutation(createAddMutationCommand({}));

        const response = await handle({
          path: '/conversations',
          method: 'GET',
        });

        assertHttpResponse({
          response,
          expectedStatusCode: 200,
          expectedBody: {
            ok: true,
            conversations: [conversation1, conversation2].map(transform),
          },
        });
      });
    });
  });
});
