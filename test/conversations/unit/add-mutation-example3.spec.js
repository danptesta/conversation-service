/* eslint-disable prefer-arrow-callback,func-names,quote-props,
  class-methods-use-this,no-unused-expressions,global-require */

const makeApp = require('../../../src/conversations/app');
const repositoryFixture = require('../fixtures/conversation-repo-fixture')();
const {
  testAddMutationInsert,
  testAddMutationDelete,
} = require('../helpers/test-add-mutation');

describe('app:', function () {
  let app;

  beforeEach(async function () {
    const repository = repositoryFixture.createMemoryRepo();
    app = makeApp({ repository });
  });

  describe('#addMutation() - Example 3:', function () {
    context('When Alice and Bob add delete and insert mutations', function () {
      const testExample3Insert = async ({
        author, index, text, origin, expected,
      }) => {
        await testAddMutationInsert({
          app, author, conversationId: 'example3', index, text, origin, expected,
        });
      };

      const testExample3Delete = async ({
        author, index, length, origin, expected,
      }) => {
        await testAddMutationDelete({
          app, author, conversationId: 'example3', index, length, origin, expected,
        });
      };

      it('should return text with the deleted and inserted words', async function () {
        await testExample3Insert({
          author: 'bob', index: 0, text: 'The', origin: { bob: 0, alice: 0 }, expected: 'The',
        });
        await testExample3Insert({
          author: 'bob', index: 3, text: ' house', origin: { bob: 1, alice: 0 }, expected: 'The house',
        });
        await testExample3Insert({
          author: 'bob', index: 9, text: ' is', origin: { bob: 2, alice: 0 }, expected: 'The house is',
        });
        await testExample3Insert({
          author: 'bob', index: 12, text: ' red.', origin: { bob: 3, alice: 0 }, expected: 'The house is red.',
        });
        await testExample3Delete({
          author: 'bob', index: 13, length: 4, origin: { bob: 4, alice: 0 }, expected: 'The house is ',
        });
        await testExample3Insert({
          author: 'bob', index: 13, text: 'blue.', origin: { bob: 5, alice: 0 }, expected: 'The house is blue.',
        });
        await testExample3Delete({
          author: 'alice', index: 13, length: 4, origin: { bob: 6, alice: 0 }, expected: 'The house is .',
        });
        await testExample3Insert({
          author: 'alice', index: 13, text: 'green', origin: { bob: 6, alice: 1 }, expected: 'The house is green.',
        });
      });
    });
  });
});
