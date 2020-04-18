/* eslint-disable prefer-arrow-callback,func-names,quote-props,
  class-methods-use-this,no-unused-expressions,global-require */

const makeApp = require('../../../src/conversations/app');
const { createAddMutationCommand } = require('../fixtures/conversations-fixture');
const repositoryFixture = require('../fixtures/conversation-repo-fixture')();
const {
  InvalidPropertyError,
  InvalidInputError,
} = require('../../../src/helpers/errors');

describe('app:', function () {
  let app;

  beforeEach(async function () {
    const repository = repositoryFixture.createMemoryRepo();
    app = makeApp({ repository });
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

  describe('#addMutation() - validate input:', function () {
    context('When the input schema is invalid:', function () {
      const rejectInvalidInput = async (invalidInput, customMessage) => {
        const command = createAddMutationCommand({});
        await rejectAddMutation({
          command: { ...command, ...invalidInput },
          error: InvalidInputError,
          customMessage,
        });
      };

      it('should throw an error', async function () {
        await rejectInvalidInput({ conversationId: null });
        await rejectInvalidInput({ conversationId: undefined });
        await rejectInvalidInput({ conversationId: 1 }, 'must be a string');
        await rejectInvalidInput({ conversationId: 'x y' }, 'no space allowed');
        await rejectInvalidInput({ conversationId: 'x' }, 'must be >= 2 chars');
        await rejectInvalidInput({ author: 'dan' }, 'must be alice or bob');
        await rejectInvalidInput({ invalidField: 'xyz' }, 'field not allowed');
        // etc, etc, many possible permutations of invalid input
        // this is quick/simple way to guard against invalid input,
        // but not very user-friendly.  if I had more time I would improve
        // the error handling to indicate what is wrong with the input.
      });
    });

    context('When length is given on insert:', function () {
      it('should throw an error', async function () {
        await rejectAddMutation({
          command: createAddMutationCommand({
            data: {
              index: 0, length: 1, text: 'hello', type: 'insert',
            },
          }),
          error: InvalidPropertyError,
          errorMessage: 'length is not allowed on insert',
        });
      });
    });

    context('When text is given on delete:', function () {
      it('should throw an error', async function () {
        await rejectAddMutation({
          command: createAddMutationCommand({
            data: {
              index: 0, length: 1, text: 'hello', type: 'delete',
            },
          }),
          error: InvalidPropertyError,
          errorMessage: 'text is not allowed on delete',
        });
      });
    });

    context('When the origin does not match current state:', function () {
      it('should throw an error', async function () {
        await rejectAddMutation({
          command: createAddMutationCommand({ origin: { alice: 0, bob: 1 } }),
          error: InvalidPropertyError,
          errorMessage: 'origin does not match current state',
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
