/* eslint-disable prefer-arrow-callback,func-names,quote-props,
  class-methods-use-this,no-unused-expressions,global-require */

const makeApp = require('../../../src/conversations/app');
const repositoryFixture = require('../fixtures/conversation-repo-fixture')();
const { ConversationNotFoundError } = require('../../../src/helpers/errors');

describe.skip('app:', function () {
  let app;

  beforeEach(async function () {
    const repository = repositoryFixture.createMemoryRepo();
    app = makeApp({ repository });
  });

  context('When accessing app.removeConversation:', function () {
    it('should return a function', function () {
      app.removeConversation.should.be.a('function');
    });
  });

  describe('#removeConversation():', function () {
    context('When removing a conversation that does not exist:', function () {
      it('should throw an error', async function () {
        await app.removeConversation('does_not_exist').should.be.rejectedWith(ConversationNotFoundError);
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

      it('should remove the conversation', async function () {
        const remove = 'remove-conversation';
        await createConversation(remove);
        await app.removeConversation(remove);
        await app.findConversationById(remove).should.be.rejectedWith(ConversationNotFoundError);
      });
    });
  });
});
