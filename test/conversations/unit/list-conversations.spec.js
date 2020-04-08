/* eslint-disable prefer-arrow-callback,func-names,quote-props,
  class-methods-use-this,no-unused-expressions,global-require */

const { createAddMutationCommand } = require('../fixtures/conversations-fixture');
const makeApp = require('../../../src/conversations/app');
const repositoryFixture = require('../fixtures/conversation-repo-fixture')();

describe('app:', function () {
  let app;

  beforeEach(async function () {
    const repository = repositoryFixture.createMemoryRepo();
    app = makeApp({ repository });
  });

  context('When accessing app.listConversations:', function () {
    it('should return a function', function () {
      app.listConversations.should.be.a('function');
    });
  });

  describe('#listConversations():', function () {
    context('When no conversations exist:', function () {
      it('should return empty array', async function () {
        const result = await app.listConversations();
        should.exist(result);
        result.should.be.an.array().of.length(0);
      });
    });

    context('When conversations exist:', function () {
      it('should return the conversations', async function () {
        const conversation1 = await app.addMutation(createAddMutationCommand({}));
        const conversation2 = await app.addMutation(createAddMutationCommand({}));
        const result = await app.listConversations();
        should.exist(result);
        result.should.be.an.array().of.length(2);
        result[0].should.deep.equal(conversation1);
        result[1].should.deep.equal(conversation2);
      });
    });
  });
});
