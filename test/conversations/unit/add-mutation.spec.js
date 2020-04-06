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

  describe('#addMutation():', function () {
    context('When the input format is invalid:', function () {
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
        await rejectInvalidInput({ conversationId: 'xx' }, 'must be >= 3 chars');
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

    /*
    Exemple 1 - only insert mutations from Bob
Let's say Bob wants to write the text "The house is red.". He will write "The", then "house", "is" and finally "red.".
This will lead to the following mutations:
B(0, 0)INS0:'The'B(1, 0)INS3:' house'B(2, 0)INS9:' is'B(3, 0)INS12:' red.'. The state is now in the position (4, 0).
    */

    context('When the origin does not match current state:', function () {
      it('should throw an error', async function () {
        await rejectAddMutation({
          command: createAddMutationCommand({ origin: { alice: 0, bob: 1 } }),
          error: InvalidPropertyError,
          errorMessage: 'origin does not match current state',
        });
      });
    });

    context('When Bob inserts mutations', function () {
      const testBobInsert = async ({ index, text, bob }) => {
        const command = {
          author: 'bob',
          conversationId: 'only-bob_only-insert',
          data: {
            index,
            text,
            type: 'insert',
          },
          origin: {
            alice: 0,
            bob,
          },
        };

        const result = await app.addMutation(command);
        result.should.equal('The');
      };

      it('should succeed', async function () {
        await testBobInsert({ index: 0, text: 'The', bob: 0 });
      });
    });

    async function rejectAddMutation({
      command, error, errorMessage, customMessage,
    }) {
      await app.addMutation(command).should.be.rejectedWith(error, errorMessage, customMessage);
    }
  });
});
