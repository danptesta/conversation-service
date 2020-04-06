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

  describe('#addMutation() - Example 2:', function () {
    context('When Bob adds delete and insert mutations', function () {
      const testBobInsert = async ({
        index, text, bob, expected,
      }) => {
        const command = {
          author: 'bob',
          conversationId: 'example2',
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

      const testBobDelete = async ({
        index, length, bob, expected,
      }) => {
        const command = {
          author: 'bob',
          conversationId: 'example2',
          data: {
            index,
            length,
            type: 'delete',
          },
          origin: {
            alice: 0,
            bob,
          },
        };

        const result = await app.addMutation(command);
        result.should.equal(expected, `Bob delete: index=${index}, bob=${bob}, length=${length}`);
      };

      it('should return text with the deleted and inserted words', async function () {
        await testBobInsert({
          index: 0, text: 'The', bob: 0, expected: 'The',
        });
        await testBobInsert({
          index: 3, text: ' house', bob: 1, expected: 'The house',
        });
        await testBobInsert({
          index: 9, text: ' is', bob: 2, expected: 'The house is',
        });
        await testBobInsert({
          index: 12, text: ' red.', bob: 3, expected: 'The house is red.',
        });
        await testBobDelete({
          index: 13, length: 4, bob: 4, expected: 'The house is ',
        });
        await testBobInsert({
          index: 13, text: 'blue.', bob: 5, expected: 'The house is blue.',
        });
      });
    });
  });
});
