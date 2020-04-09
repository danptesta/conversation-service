/* eslint-disable prefer-arrow-callback,func-names,quote-props,
  class-methods-use-this,no-unused-expressions,global-require */

const { createAddMutationCommand } = require('../fixtures/conversations-fixture');
const makeApp = require('../../../src/conversations/app');
const repositoryFixture = require('../fixtures/conversation-repo-fixture')();
const { ConversationNotFoundError } = require('../../../src/helpers/errors');

describe('app:', function () {
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
    context('When removing a conversation that exists:', function () {
      it('should remove the conversation', async function () {
        const command = createAddMutationCommand({});
        await app.addMutation(command);
        await app.removeConversation(command.conversationId);
        await app.findConversationById(command.conversationId).should.be.rejectedWith(ConversationNotFoundError);
      });
    });
  });
});
