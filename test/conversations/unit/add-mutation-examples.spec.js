/* eslint-disable no-await-in-loop */
/* eslint-disable prefer-arrow-callback,func-names,quote-props,
  class-methods-use-this,no-unused-expressions,global-require */

const makeApp = require('../../../src/conversations/app');
const repositoryFixture = require('../fixtures/conversation-repo-fixture')();
const testAddMutations = require('../helpers/test-add-mutations');

describe.only('app:', function () {
  let app;

  beforeEach(async function () {
    const repository = repositoryFixture.createMemoryRepo();
    app = makeApp({ repository });
  });

  describe('#addMutation() - examples:', function () {
    context('Example 1 - only insert mutations from Bob:', function () {
      it('should return the expected results', async function () {
        await testAddMutations(app, 'example1');
      });
    });

    context('Example 2 - insert and delete mutations from Bob:', function () {
      it('should return the expected results', async function () {
        await testAddMutations(app, 'example1');
        await testAddMutations(app, 'example2');
      });
    });

    context('Example 3 - insert mutations from Bob and Alice, without conflicts:', function () {
      it('should return the expected results', async function () {
        await testAddMutations(app, 'example1');
        await testAddMutations(app, 'example2');
        await testAddMutations(app, 'example3');
      });
    });

    context('Example 4a - insert mutations from Bob and Alice, with conflicts:', function () {
      it('should return the expected results', async function () {
        await testAddMutations(app, 'example1');
        await testAddMutations(app, 'example2');
        await testAddMutations(app, 'example3');
        await testAddMutations(app, 'example4a');
      });
    });

    context('Example 4b - insert mutations from Bob and Alice, with conflicts reversed:', function () {
      it('should return the expected results (commutative)', async function () {
        await testAddMutations(app, 'example1');
        await testAddMutations(app, 'example2');
        await testAddMutations(app, 'example3');
        await testAddMutations(app, 'example4b');
      });
    });

    context('When there is delete-insert conflict with origin shift only:', function () {
      it('should return the expected results', async function () {
        await testAddMutations(app, 'conflict-delete-insert1');
      });
    });

    context('When there is delete-insert conflict with origin and data shift:', function () {
      it('should return the expected results', async function () {
        await testAddMutations(app, 'conflict-delete-insert2');
      });
    });

    context('When there is delete-delete conflict:', function () {
      it('should return the expected results', async function () {
        await testAddMutations(app, 'conflict-delete-delete1');
      });
    });
  });
});
