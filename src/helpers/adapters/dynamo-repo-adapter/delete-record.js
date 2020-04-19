const makeDeleteRecord = ({
  tableName,
  docClient,
  logger,
  partitionKey,
}) => {
  const deleteRecord = async (id) => {
    const Key = {};
    Key[partitionKey] = id;
    const params = {
      TableName: tableName,
      Key,
    };

    const startTime = Date.now();
    try {
      const response = await docClient.delete(params).promise();
      logger.logDynamoResponse({
        method: 'deleteRecord', startTime, params, response,
      });
    } catch (error) {
      logger.logDynamoError({
        method: 'deleteRecord', startTime, params, error,
      });
      throw error;
    }
  };

  return deleteRecord;
};

module.exports = makeDeleteRecord;
