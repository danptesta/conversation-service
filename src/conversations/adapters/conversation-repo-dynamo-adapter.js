const makeDynamoRepoAdapter = require('../../helpers/adapters/dynamo-repo-adapter');

const makeConversationRepoDynamoAdapter = (tableName = process.env.CONVERSATIONS_TABLE || 'CONVERSATIONS') => {
  const dynamoRepoAdapter = makeDynamoRepoAdapter({
    service: 'conversation',
    port: 'conversation-repo',
    tableName,
    idField: 'conversationId',
  });

  const insertRecord = async (record) => {
    await dynamoRepoAdapter.insertRecord(record);
  };

  return Object.freeze({
    insertRecord,
    generateId: dynamoRepoAdapter.generateId,
    findRecordById: dynamoRepoAdapter.findRecordById,
    updateRecord: dynamoRepoAdapter.updateRecord,
    findRecords: dynamoRepoAdapter.findRecords,
    countRecords: dynamoRepoAdapter.countRecords,
  });
};

module.exports = makeConversationRepoDynamoAdapter;
