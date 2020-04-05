/* eslint-disable prefer-arrow-callback,func-names,quote-props,
  class-methods-use-this,no-unused-expressions,global-require */

const makeApp = require('../../../src/conversations/app');
const rejectMissingFields = require('../helpers/reject-missing-fields');
const rejectUnsupportedFields = require('../helpers/reject-unsupported-fields');
const rejectUnsupportedValues = require('../helpers/reject-unsupported-values');
const { createAddMutationCommand } = require('../fixtures/conversations-fixture');
// const repositoryFixture = require('../fixtures/conversation-repo-fixture')();
const {
  RequiredParameterError,
  InvalidPropertyError,
} = require('../../../src/helpers/errors');

describe('app:', function () {
  let app;

  beforeEach(async function () {
    // const repository = repositoryFixture.createMemoryRepo();
    // app = makeApp({ repository });
    app = makeApp({});
  });

  context('When instantiating the app:', function () {
    it('should return an object', function () {
      app.should.be.an('object');
    });
  });

  context('When accessing app.addMutation:', function () {
    it('should return a function', function () {
      app.addMutation.should.be.a('function');
    });
  });

  describe('#addMutation():', function () {
    context('When the conversationId is missing:', function () {
      const rejectConversationIdRequired = async (command) => {
        await rejectAddMutation({
          command,
          error: RequiredParameterError,
          errorMessage: 'Missing required fields: conversationId',
        });
      };

      it('should throw an error', async function () {
        await rejectConversationIdRequired(null);
        await rejectConversationIdRequired(undefined);
        await rejectConversationIdRequired({});
        await rejectConversationIdRequired({ conversationId: null });
        await rejectConversationIdRequired({ conversationId: undefined });
        await rejectConversationIdRequired({ conversationId: '' });
      });
    });

    context('When the conversationId is not a string', function () {
      it('should throw an error', async function () {
        await rejectAddMutation({
          command: { conversationId: 1 },
          error: InvalidPropertyError,
          errorMessage: 'conversationId must be a string',
        });
      });
    });

    context('When the mutation is missing required fields:', function () {
      it('should throw an error', async function () {
        await rejectMissingFields({
          appFunction: app.addMutation,
          createCommand: createAddMutationCommand,
          requiredFields: ['author', 'data', 'origin'],
        });
      });
    });

    context('When the mutation has unsupported fields:', function () {
      it('should throw an error', async function () {
        await rejectUnsupportedFields({
          appFunction: app.addMutation,
          createCommand: createAddMutationCommand,
          unsupportedFields: ['unsupportedField',
            'aws:rep:deleting', 'aws:rep:updatetime', 'aws:rep:updateregion'],
        });
      });
    });

    context('When the mutation has an unsupported author:', function () {
      it('should throw an error', async function () {
        await rejectAddMutation({
          command: createAddMutationCommand({ author: 'unsupported_author' }),
          error: InvalidPropertyError,
          errorMessage: 'author must be one of these values: alice, bob',
          customMessage: 'unsupported author',
        });
      });
    });

    context('When the mutation has an invalid origin:', function () {
      it('should throw an error', async function () {
        await rejectUnsupportedValues({
          appFunction: app.addMutation,
          createCommand: createAddMutationCommand,
          field: 'origin',
          errorMessage: "origin must be of the form '{ alice: x, bob: y }' where x and y are numbers >= 0",
          unsupportedValues: [
            'not an object', // must be object type
            { bob: 0 }, // missing alice
            { alice: 'not a number' },
            { alice: 0 }, // missing bob
            {}, // missing alice and bob
            { alice: 0, bob: 0, unsupportedKey: 0 },
            { alice: 0, bob: -1 }, // values must be >= 0
          ],
        });
      });
    });

    async function rejectAddMutation({
      command, error, errorMessage, customMessage,
    }) {
      await app.addMutation(command).should.be.rejectedWith(error, errorMessage, customMessage);
    }
  });
});
