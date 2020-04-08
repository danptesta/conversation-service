/* eslint-disable prefer-arrow-callback,func-names,quote-props,
  class-methods-use-this,no-unused-expressions,global-require,
  no-restricted-syntax, no-await-in-loop */

const makeApp = require('../../../src/conversations/app');
const repositoryFixture = require('../fixtures/conversation-repo-fixture')();
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

  describe('find conversation by id (GET):', function () {
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

      it('should return the conversations', async function () {
        const conversation1 = await createConversation('conversation1');
        const conversation2 = await createConversation('conversation2');

        const response = await handle({
          path: '/conversations',
          method: 'GET',
        });

        assertHttpResponse({
          response,
          expectedStatusCode: 200,
          expectedBody: {
            ok: true,
            conversations: [conversation1, conversation2],
          },
        });
      });
    });
  });
});
