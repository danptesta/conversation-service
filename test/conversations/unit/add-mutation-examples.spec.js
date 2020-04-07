/* eslint-disable no-await-in-loop */
/* eslint-disable prefer-arrow-callback,func-names,quote-props,
  class-methods-use-this,no-unused-expressions,global-require */

const fs = require('fs');
const makeApp = require('../../../src/conversations/app');
const repositoryFixture = require('../fixtures/conversation-repo-fixture')();
// const {
//   createAddMutationInsertCommand,
//   createAddMutationDeleteCommand,
// } = require('../fixtures/conversations-fixture');

describe('app:', function () {
  let app;

  beforeEach(async function () {
    const repository = repositoryFixture.createMemoryRepo();
    app = makeApp({ repository });
  });

  describe('#addMutation() - examples:', function () {
    const testAddMutation = async ({ command, expected }) => {
      const result = await app.addMutation(command);
      result.conversationId.should.equal(command.conversationId, 'conversationId');
      result.text.should.equal(expected.text, `text, command = ${JSON.stringify(command)}`);
      result.state.should.deep.equal(expected.state, `state, command = ${JSON.stringify(command)}`);
    };

    const runTests = async (dataFile) => {
      const tests = JSON.parse(fs.readFileSync(`test/conversations/data/${dataFile}.json`, 'utf-8'));
      for (let i = 0; i < tests.length; i += 1) {
        await testAddMutation({
          command: tests[i].mutation,
          expected: tests[i].expected,
        });
      }
    };

    context('Example 1 - only insert mutations from Bob:', function () {
      it('should return the expected results', async function () {
        await runTests('example1');
      });
    });

    context('Example 2 - insert and delete mutations from Bob:', function () {
      it('should return the expected results', async function () {
        await runTests('example1');
        await runTests('example2');
      });
    });

    context('Example 3 - insert mutations from Bob and Alice, without conflicts:', function () {
      it('should return the expected results', async function () {
        await runTests('example1');
        await runTests('example2');
        await runTests('example3');
      });
    });

    context('Example 4a - insert mutations from Bob and Alice, with conflicts:', function () {
      it('should return the expected results', async function () {
        await runTests('example1');
        await runTests('example2');
        await runTests('example3');
        await runTests('example4a');
      });
    });

    context('Example 4b - insert mutations from Bob and Alice, with conflicts reversed:', function () {
      it('should return the exected results (commutative)', async function () {
        await runTests('example1');
        await runTests('example2');
        await runTests('example3');
        await runTests('example4b');
      });
    });
  });
});
