const makeMemoryRepository = require('../../../src/conversations/adapters/mutation-repo-memory-adapter');
const makeDynamoRepository = require('../../../src/conversations/adapters/mutation-repo-dynamo-adapter');

module.exports = function makeRepositoryFixture() {
  return Object.freeze({
    createMemoryRepo,
    createDynamoRepo,
  });

  function createMemoryRepo() {
    return makeMemoryRepository();
  }

  function createDynamoRepo(tableName) {
    return makeDynamoRepository(tableName);
  }
};
