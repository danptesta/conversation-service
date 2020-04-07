/* eslint-disable prefer-arrow-callback,func-names,quote-props,
  class-methods-use-this,no-unused-expressions,global-require */

const makeApp = require('../../../src/conversations/app');
const repositoryFixture = require('../fixtures/conversation-repo-fixture')();
const {
  testAddMutationInsert,
  testAddMutationDelete,
} = require('../helpers/test-add-mutation');
const {
  createAddMutationInsertCommand,
  createAddMutationDeleteCommand,
} = require('../fixtures/conversations-fixture');

describe('app:', function () {
  let app;

  beforeEach(async function () {
    const repository = repositoryFixture.createMemoryRepo();
    app = makeApp({ repository });
  });

  describe('#addMutation() - Example 4:', function () {
    context('When Alice and Bob add delete and insert conflicting mutations', function () {
      const testExample4Insert = async ({
        author, index, text, origin, expected,
      }) => {
        await testAddMutationInsert({
          app, author, conversationId: 'example4', index, text, origin, expected,
        });
      };

      const testExample4Delete = async ({
        author, index, length, origin, expected,
      }) => {
        await testAddMutationDelete({
          app, author, conversationId: 'example4', index, length, origin, expected,
        });
      };

      const addPrerequisiteMutations = async () => {
        await testExample4Insert({
          author: 'bob', index: 0, text: 'The', origin: { bob: 0, alice: 0 }, expected: 'The',
        });
        await testExample4Insert({
          author: 'bob', index: 3, text: ' house', origin: { bob: 1, alice: 0 }, expected: 'The house',
        });
        await testExample4Insert({
          author: 'bob', index: 9, text: ' is', origin: { bob: 2, alice: 0 }, expected: 'The house is',
        });
        await testExample4Insert({
          author: 'bob', index: 12, text: ' red.', origin: { bob: 3, alice: 0 }, expected: 'The house is red.',
        });
        await testExample4Delete({
          author: 'bob', index: 13, length: 4, origin: { bob: 4, alice: 0 }, expected: 'The house is ',
        });
        await testExample4Insert({
          author: 'bob', index: 13, text: 'blue.', origin: { bob: 5, alice: 0 }, expected: 'The house is blue.',
        });
        await testExample4Delete({
          author: 'alice', index: 13, length: 4, origin: { bob: 6, alice: 0 }, expected: 'The house is .',
        });
        await testExample4Insert({
          author: 'alice', index: 13, text: 'green', origin: { bob: 6, alice: 1 }, expected: 'The house is green.',
        });
      };

      it('should transform the conflicting mutations and return the correct text', async function () {
        await addPrerequisiteMutations();
        await testExample4Insert({
          author: 'alice', index: 3, text: ' big', origin: { bob: 6, alice: 2 }, expected: 'The big house is green.',
        });
        await testExample4Insert({
          author: 'bob', index: 18, text: ' and yellow', origin: { bob: 6, alice: 2 }, expected: 'The big house is green and yellow.',
        });
      });

      it('should transform the conflicting mutations commutatively', async function () {
        await addPrerequisiteMutations();
        await testExample4Insert({
          author: 'bob', index: 18, text: ' and yellow', origin: { bob: 6, alice: 2 }, expected: 'The house is green and yellow.',
        });
        // await testExample4Insert({
        //   author: 'alice', index: 3, text: ' big', origin: { bob: 6, alice: 2 }, expected: 'The big house is green and yellow.',
        // });
      });
    });
  });
});
