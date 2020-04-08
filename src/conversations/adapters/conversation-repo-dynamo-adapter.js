const makeDynamoRepoAdapter = require('../../helpers/adapters/dynamo-repo-adapter');

const makeConversationRepoDynamoAdapter = (tableName = process.env.CONVERSATIONS_TABLE || 'CONVERSATIONS') => {
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
  });
};

module.exports = makeConversationRepoDynamoAdapter;
