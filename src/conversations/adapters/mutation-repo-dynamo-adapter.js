const makeDynamoRepoAdapter = require('../../helpers/adapters/dynamo-repo-adapter');

const makeMutationRepoDynamoAdapter = (tableName = 'mutations') => {
  const dynamoRepoAdapter = makeDynamoRepoAdapter({
    service: 'conversation',
    port: 'conversation-repo',
    tableName,
    partitionKey: 'conversationId',
    sortKey: 'timestamp',
  });

  const addTimestamp = mutation => ({
    ...mutation,
    timestamp: Date.now(),
  });

  return Object.freeze({
    addMutation: async (mutation) => {
      await dynamoRepoAdapter.insertRecord(addTimestamp(mutation));
    },
    findMutationsByConversationId: dynamoRepoAdapter.findRecordsById,
    listMutations: dynamoRepoAdapter.listRecords,
    // todo: deleteMutationsByConversationId: dynamoRepoAdapter.deleteRecords,
  });
};

module.exports = makeMutationRepoDynamoAdapter;
