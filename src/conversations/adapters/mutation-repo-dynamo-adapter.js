const makeDynamoRepoAdapter = require('../../helpers/adapters/dynamo-repo-adapter');

const makeMutationRepoDynamoAdapter = (tableName = 'conversations') => {
  const dynamoRepoAdapter = makeDynamoRepoAdapter({
    service: 'conversation',
    port: 'conversation-repo',
    tableName,
    idField: 'conversationId',
  });

  return Object.freeze({
    insertConversation: dynamoRepoAdapter.insertRecord,
    findConversationById: dynamoRepoAdapter.findRecordById,
    updateConversation: dynamoRepoAdapter.updateRecord,
    listConversations: dynamoRepoAdapter.listRecords,
    deleteConversation: dynamoRepoAdapter.deleteRecord,
  });
};

module.exports = makeMutationRepoDynamoAdapter;
