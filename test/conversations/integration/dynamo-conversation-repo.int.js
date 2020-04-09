/* eslint-disable prefer-arrow-callback,func-names,quote-props,
  class-methods-use-this,no-unused-expressions,global-require */

const _ = require('lodash');
const testExample = require('../helpers/test-example');
const { createAddMutationCommand } = require('../fixtures/conversations-fixture');
const makeApp = require('../../../src/conversations/app');
const repositoryFixture = require('../fixtures/conversation-repo-fixture')();
const { createTestTable, deleteTestTable } = require('./dynamo-conversation-repo-helper');
const {
  ConversationNotFoundError,
} = require('../../../src/helpers/errors');

const tableName = `conversationTest${new Date().getTime()}`;

describe('app (conversation-repo-dynamo-adapter integration):', function () {
  this.timeout(120000);
  let app;

  before(async function () {
    await createTestTable(tableName);
    const repository = repositoryFixture.createDynamoRepo(tableName);
    app = makeApp({ repository });
  });

  after(async function () {
    await deleteTestTable(tableName);
  });

  context('When adding a example 1 mutations:', function () {
    it('should return the expected results', async function () {
      await testExample(app, 'example1');
    });
  });

  context('When finding a conversation by id that does not exist', function () {
    it('should throw an error', async function () {
      await app.findConversationById('does_not_exist').should.be.rejectedWith(ConversationNotFoundError);
    });
  });

  context('When finding a conversation by id that exists:', function () {
    it('should return the conversation', async function () {
      const conversation = await app.addMutation(createAddMutationCommand({}));
      // dynamodb reads are eventually consistent (usually within 10ms)
      await sleep(100);
      const result = await app.findConversationById(conversation.conversationId);
      should.exist(result);
      result.should.deep.equal(conversation);
    });
  });

  context('When listing conversations:', function () {
    it('should return the conversations', async function () {
      const conversation = await app.addMutation(createAddMutationCommand({}));
      // dynamodb reads are eventually consistent (usually within 10ms)
      await sleep(100);
      const result = await app.listConversations();
      should.exist(result);
      result.should.be.an.array();
      const found = _.find(result, { conversationId: conversation.conversationId });
      should.exist(found);
      found.should.deep.equal(conversation);
    });
  });

  context('When removing a conversation that does not exist:', function () {
    it('should throw an error', async function () {
      await app.removeConversation('does_not_exist').should.be.rejectedWith(ConversationNotFoundError);
    });
  });

  context('When removing a conversation that exists:', function () {
    it('should remove the conversation', async function () {
      const command = createAddMutationCommand({});
      await app.addMutation(command);
      // dynamodb reads are eventually consistent (usually within 10ms)
      await sleep(100);
      await app.removeConversation(command.conversationId);
      // dynamodb reads are eventually consistent (usually within 10ms)
      await sleep(100);
      await app.findConversationById(command.conversationId).should.be.rejectedWith(ConversationNotFoundError);
    });
  });

  async function sleep(ms) {
    const sleeping = new Promise((resolve) => {
      setTimeout(async function () {
        resolve('done sleeping');
      }, ms);
    });
    await sleeping;
  }
});
