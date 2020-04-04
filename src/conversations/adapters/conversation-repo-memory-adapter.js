const makeMemoryRepoAdapter = require('../../helpers/adapters/memory-repo-adapter');

const makeConversationRepoMemoryAdapter = (seedData = []) => {
  const memoryRepoAdapter = makeMemoryRepoAdapter({
    idField: 'conversationId',
    seedData,
  });

  return Object.freeze({
    insertRecord: memoryRepoAdapter.insertRecord,
    findRecordById: memoryRepoAdapter.findRecordById,
    updateRecord: memoryRepoAdapter.updateRecord,
    generateId: memoryRepoAdapter.generateId,
    findRecords: memoryRepoAdapter.findRecords,
    countRecords: memoryRepoAdapter.countRecords,
  });
};

module.exports = makeConversationRepoMemoryAdapter;
