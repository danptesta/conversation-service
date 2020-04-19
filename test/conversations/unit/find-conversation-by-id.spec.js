/* eslint-disable prefer-arrow-callback,func-names,quote-props,
  class-methods-use-this,no-unused-expressions,global-require */

const { createAddMutationCommand } = require('../fixtures/conversations-fixture');
const makeApp = require('../../../src/conversations/app');
const repositoryFixture = require('../fixtures/mutation-repo-fixture')();
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
      it('should return the conversations', async function () {
        const command = createAddMutationCommand({});
        const conversation = await app.addMutation(command);
        const result = await app.findConversationById(command.conversationId);
        should.exist(result);
        result.should.deep.equal(conversation, 'existing conversation');
      });
    });
  });
});
