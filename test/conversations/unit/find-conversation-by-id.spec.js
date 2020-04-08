/* eslint-disable prefer-arrow-callback,func-names,quote-props,
  class-methods-use-this,no-unused-expressions,global-require */

const makeApp = require('../../../src/conversations/app');
const repositoryFixture = require('../fixtures/conversation-repo-fixture')();
const { ConversationNotFoundError } = require('../../../src/helpers/errors');

describe('app:', function () {
  let app;

  beforeEach(async function () {
    const repository = repositoryFixture.createMemoryRepo();
    app = makeApp({ repository });
  });

  context('When accessing app.findConversationById:', function () {
    it('should return a function', function () {
      app.findConversationById.should.be.a('function');
    });
  });

  describe('#findConversationById():', function () {
    context('When finding a conversation that does not exist:', function () {
      it('should throw an error', async function () {
        await app.findConversationById('does_not_exist').should.be.rejectedWith(ConversationNotFoundError);
      });
    });

    context('When finding a conversation that exists:', function () {
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
        const existingId = 'existing-conversation';
        const conversation = await createConversation(existingId);
        const result = await app.findConversationById(existingId);
        should.exist(result);
        result.should.deep.equal(conversation, 'existing conversation');
      });
    });
  });
});
