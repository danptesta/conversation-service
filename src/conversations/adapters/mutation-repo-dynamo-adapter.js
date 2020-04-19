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

  const removeTimestamp = (mutations) => {
    const result = [];
    mutations.forEach((mutation) => {
      const { timestamp, ...restOfMutation } = mutation;
      result.push(restOfMutation);
    });
    return result;
  };

  return Object.freeze({
    addMutation: async (mutation) => {
      await dynamoRepoAdapter.insertRecord(addTimestamp(mutation));
    },
    findMutationsByConversationId: async (conversationId) => {
      const mutations = await dynamoRepoAdapter.findRecordsById(conversationId);
      return removeTimestamp(mutations);
    },
    listMutations: async () => {
      const mutations = await dynamoRepoAdapter.listRecords();
      return removeTimestamp(mutations);
    },
    deleteMutationsByConversationId: dynamoRepoAdapter.deleteRecords,
  });
};

module.exports = makeMutationRepoDynamoAdapter;
