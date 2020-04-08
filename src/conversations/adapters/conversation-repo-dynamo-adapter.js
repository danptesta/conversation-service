const makeDynamoRepoAdapter = require('../../helpers/adapters/dynamo-repo-adapter');
const {
  EntityNotFoundError,
  ConversationNotFoundError,
} = require('../../helpers/errors');

const makeConversationRepoDynamoAdapter = (tableName = process.env.CONVERSATIONS_TABLE || 'CONVERSATIONS') => {
  const dynamoRepoAdapter = makeDynamoRepoAdapter({
    service: 'conversation',
    port: 'conversation-repo',
    tableName,
    idField: 'conversationId',
  });

  const deleteConversation = async (conversationId) => {
    try {
      await dynamoRepoAdapter.deleteRecord(conversationId);
    } catch (error) {
      if (error instanceof EntityNotFoundError) throw new ConversationNotFoundError();
      throw error;
    }
  };

  return Object.freeze({
    insertConversation: dynamoRepoAdapter.insertRecord,
    findConversationById: dynamoRepoAdapter.findRecordById,
    updateConversation: dynamoRepoAdapter.updateRecord,
    listConversations: dynamoRepoAdapter.listRecords,
    deleteConversation,
  });
};

module.exports = makeConversationRepoDynamoAdapter;
