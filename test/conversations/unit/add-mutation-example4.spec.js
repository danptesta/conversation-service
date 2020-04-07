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

  describe('#addMutation() - Example 4:', function () {
    context('When Alice and Bob add delete and insert conflicting mutations', function () {
      const testInsert = async ({
        author, index, text, origin, expected,
      }) => {
        const command = {
          author,
          conversationId: 'example4',
          data: {
            index,
            text,
            type: 'insert',
          },
          origin,
        };

        const result = await app.addMutation(command);
        result.should.equal(expected, `insert: author=${author}, index=${index}, `
          + `origin=${JSON.stringify(origin)}, text=[${text}]`);
      };

      const testDelete = async ({
        author, index, length, origin, expected,
      }) => {
        const command = {
          author,
          conversationId: 'example4',
          data: {
            index,
            length,
            type: 'delete',
          },
          origin,
        };

        const result = await app.addMutation(command);
        result.should.equal(expected, `delete: author=${author}, index=${index}, `
          + `origin=${JSON.stringify(origin)}, length=${length}`);
      };

      it('should transform the conflicting mutations and return the correct text', async function () {
        await testInsert({
          author: 'bob', index: 0, text: 'The', origin: { bob: 0, alice: 0 }, expected: 'The',
        });
        await testInsert({
          author: 'bob', index: 3, text: ' house', origin: { bob: 1, alice: 0 }, expected: 'The house',
        });
        await testInsert({
          author: 'bob', index: 9, text: ' is', origin: { bob: 2, alice: 0 }, expected: 'The house is',
        });
        await testInsert({
          author: 'bob', index: 12, text: ' red.', origin: { bob: 3, alice: 0 }, expected: 'The house is red.',
        });
        await testDelete({
          author: 'bob', index: 13, length: 4, origin: { bob: 4, alice: 0 }, expected: 'The house is ',
        });
        await testInsert({
          author: 'bob', index: 13, text: 'blue.', origin: { bob: 5, alice: 0 }, expected: 'The house is blue.',
        });
        await testDelete({
          author: 'alice', index: 13, length: 4, origin: { bob: 6, alice: 0 }, expected: 'The house is .',
        });
        await testInsert({
          author: 'alice', index: 13, text: 'green', origin: { bob: 6, alice: 1 }, expected: 'The house is green.',
        });
        await testInsert({
          author: 'alice', index: 3, text: ' big', origin: { bob: 6, alice: 2 }, expected: 'The big house is green.',
        });
        await testInsert({
          author: 'bob', index: 18, text: ' and yellow', origin: { bob: 6, alice: 2 }, expected: 'The big house is green and yellow.',
        });
      });
    });
  });
});
