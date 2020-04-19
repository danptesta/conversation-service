const makeDeleteRecords = ({
  tableName,
  docClient,
  logger,
  partitionKey,
  sortKey,
  findRecordsById,
}) => {
  const makeDeleteRequest = (recordToDelete) => {
    const result = {
      DeleteRequest: {
        Key: {
          // partitionKey: 'somePartitionKey',
          // sortKey: 'someSortKey',
        },
      },
    };
    result.DeleteRequest.Key[partitionKey] = recordToDelete[partitionKey];
    result.DeleteRequest.Key[sortKey] = recordToDelete[sortKey];
    return result;
  };

  const makeParams = (recordsToDelete) => {
    const result = {
      RequestItems: {
        // tableName: [
        //   {
        //     DeleteRequest: {
        //       Key: {
        //         partitionKey: 'somePartitionKey',
        //         sortKey: 'someSortKey',
        //       },
        //     },
        //   },
        // ],
      },
    };
    result.RequestItems[tableName] = [];
    recordsToDelete.forEach((recordToDelete) => {
      result.RequestItems[tableName].push(makeDeleteRequest(recordToDelete));
    });
    return result;
  };

  const deleteRecords = async (id) => {
    const recordsToDelete = findRecordsById(id);
    const params = makeParams(recordsToDelete);

    const startTime = Date.now();
    try {
      const response = await docClient.batchWrite(params).promise();
      logger.logDynamoResponse({
        method: 'deleteRecords', startTime, params, response,
      });
    } catch (error) {
      logger.logDynamoError({
        method: 'deleteRecords', startTime, params, error,
      });
      throw error;
    }
  };

  return deleteRecords;
};

module.exports = makeDeleteRecords;
