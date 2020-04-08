const makeMemoryRepoAdapter = require('../../helpers/adapters/memory-repo-adapter');
const {
  EntityNotFoundError,
  ConversationNotFoundError,
} = require('../../helpers/errors');

const makeMemoryMigrationRepoAdapter = () => {
  const memoryRepoAdapter = makeMemoryRepoAdapter({
    idField: 'conversationId',
  });

  const deleteConversation = async (conversationId) => {
    try {
      await memoryRepoAdapter.deleteRecord(conversationId);
    } catch (error) {
      if (error instanceof EntityNotFoundError) throw new ConversationNotFoundError();
      throw error;
    }
  };

  return Object.freeze({
    insertConversation: memoryRepoAdapter.insertRecord,
    findConversationById: memoryRepoAdapter.findRecordById,
    updateConversation: memoryRepoAdapter.updateRecord,
    listConversations: memoryRepoAdapter.listRecords,
    deleteConversation,
  });
};

module.exports = makeMemoryMigrationRepoAdapter;
