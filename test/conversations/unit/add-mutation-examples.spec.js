/* eslint-disable no-await-in-loop */
/* eslint-disable prefer-arrow-callback,func-names,quote-props,
  class-methods-use-this,no-unused-expressions,global-require */

const makeApp = require('../../../src/conversations/app');
const { createAddMutationCommand } = require('../fixtures/conversations-fixture');
const repositoryFixture = require('../fixtures/mutation-repo-fixture')();
const testAddMutations = require('../helpers/test-add-mutations');
const {
  InvalidPropertyError,
} = require('../../../src/helpers/errors');

describe('app:', function () {
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

    context('When there is a delete-insert conflict with origin shift only:', function () {
      it('should return the expected results', async function () {
        await testAddMutations(app, 'conflict-delete-insert1');
      });
    });

    context('When there is a delete-insert conflict with origin and data shift:', function () {
      it('should return the expected results', async function () {
        await testAddMutations(app, 'conflict-delete-insert2');
      });
    });

    context('When there is a insert-delete conflict:', function () {
      it('should return the expected results', async function () {
        await testAddMutations(app, 'conflict-insert-delete1');
      });
    });

    context('When there is a delete-delete conflict with origin and data (index + length) shift:', function () {
      it('should return the expected results', async function () {
        await testAddMutations(app, 'conflict-delete-delete1');
      });
    });

    context('When there is a delete-delete conflict with origin and data (index only) shift:', function () {
      it('should return the expected results', async function () {
        await testAddMutations(app, 'conflict-delete-delete2');
      });
    });

    context('When there are multiple delayed mutations:', function () {
      it('should return the expected results', async function () {
        await testAddMutations(app, 'conflict-multiple-delays');
      });
    });

    // context('When there are many conflicts:', function () {
    //   it('should return the expected results', async function () {
    //     await testAddMutations(app, 'conflict-many');
    //   });
    // });

    context('When the origin (0,0) is used on an existing conversation:', function () {
      it('should throw an error', async function () {
        // state will be at (4,0) after example1 is loaded
        await testAddMutations(app, 'example1');
        await rejectAddMutation({
          command: createAddMutationCommand({
            conversationId: 'examples',
            origin: { alice: 0, bob: 0 },
          }),
          error: InvalidPropertyError,
          errorMessage: 'cannot use origin (0,0) on existing conversation',
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
