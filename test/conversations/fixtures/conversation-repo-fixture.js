// const uuidv1 = require('uuid/v1');
const makeMemoryRepository = require('../../../src/conversations/adapters/conversation-repo-memory-adapter');
const makeDynamoRepository = require('../../../src/conversations/adapters/conversation-repo-dynamo-adapter');

module.exports = function makeRepositoryFixture() {
  return Object.freeze({
    createMemoryRepo,
    createDynamoRepo,
  });

  function createMemoryRepo() {
    return makeMemoryRepository(createSeedData());
  }

  function createDynamoRepo(tableName) {
    return makeDynamoRepository(tableName);
  }

  function createSeedData() {
    const seedData = [];
    return seedData;
  }
};
