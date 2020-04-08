const makeMemoryRepoAdapter = require('../../helpers/adapters/memory-repo-adapter');

const makeMemoryMigrationRepoAdapter = () => {
  const memoryRepoAdapter = makeMemoryRepoAdapter({
    idField: 'conversationId',
  });

  return Object.freeze({
    insertConversation: memoryRepoAdapter.insertRecord,
    findConversationById: memoryRepoAdapter.findRecordById,
    updateConversation: memoryRepoAdapter.updateRecord,
    listConversations: memoryRepoAdapter.listRecords,
    deleteConversation: memoryRepoAdapter.deleteRecord,
  });
};

module.exports = makeMemoryMigrationRepoAdapter;
