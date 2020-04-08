/* eslint-disable no-await-in-loop */
/* eslint-disable prefer-arrow-callback,func-names,quote-props,
  class-methods-use-this,no-unused-expressions,global-require */

const makeApp = require('../../../src/conversations/app');
const repositoryFixture = require('../fixtures/conversation-repo-fixture')();
const testExample = require('../helpers/test-example');

describe('app:', function () {
  let app;

  beforeEach(async function () {
    const repository = repositoryFixture.createMemoryRepo();
    app = makeApp({ repository });
  });

  describe('#addMutation() - examples:', function () {
    context('Example 1 - only insert mutations from Bob:', function () {
      it('should return the expected results', async function () {
        await testExample(app, 'example1');
      });
    });

    context('Example 2 - insert and delete mutations from Bob:', function () {
      it('should return the expected results', async function () {
        await testExample(app, 'example1');
        await testExample(app, 'example2');
      });
    });

    context('Example 3 - insert mutations from Bob and Alice, without conflicts:', function () {
      it('should return the expected results', async function () {
        await testExample(app, 'example1');
        await testExample(app, 'example2');
        await testExample(app, 'example3');
      });
    });

    context('Example 4a - insert mutations from Bob and Alice, with conflicts:', function () {
      it('should return the expected results', async function () {
        await testExample(app, 'example1');
        await testExample(app, 'example2');
        await testExample(app, 'example3');
        await testExample(app, 'example4a');
      });
    });

    context('Example 4b - insert mutations from Bob and Alice, with conflicts reversed:', function () {
      it('should return the exected results (commutative)', async function () {
        await testExample(app, 'example1');
        await testExample(app, 'example2');
        await testExample(app, 'example3');
        await testExample(app, 'example4b');
      });
    });
  });
});
