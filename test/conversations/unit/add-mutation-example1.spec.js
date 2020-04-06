/* eslint-disable prefer-arrow-callback,func-names,quote-props,
  class-methods-use-this,no-unused-expressions,global-require */

const makeApp = require('../../../src/conversations/app');
const repositoryFixture = require('../fixtures/conversation-repo-fixture')();

describe('app:', function () {
  let app;

  beforeEach(async function () {
    const repository = repositoryFixture.createMemoryRepo();
    app = makeApp({ repository });
  });

  describe('#addMutation() - Example 1:', function () {
    context('When Bob inserts mutations', function () {
      const testBobInsert = async ({
        index, text, bob, expected,
      }) => {
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
        result.should.equal(expected, `Bob insert: index=${index}, bob=${bob}, text=[${text}]`);
      };

      it('should succeed', async function () {
        await testBobInsert({
          index: 0, text: 'The', bob: 1, expected: 'The',
        });
        await testBobInsert({
          index: 3, text: ' house', bob: 2, expected: 'The house',
        });
        await testBobInsert({
          index: 3, text: ' is', bob: 3, expected: 'The house is',
        });
        await testBobInsert({
          index: 3, text: ' red.', bob: 4, expected: 'The house is red.',
        });
      });
    });
  });
});
