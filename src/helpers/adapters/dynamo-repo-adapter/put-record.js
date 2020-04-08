const makePutRecord = ({
  tableName,
  docClient,
  logger,
}) => {
  const putRecord = async (method, record) => {
    const params = {
      TableName: tableName,
      Item: record,
    };

    const startTime = Date.now();
    try {
      const response = await docClient.put(params).promise();
      logger.logDynamoResponse({
        method, startTime, params, response,
      });
    } catch (error) {
      logger.logDynamoError({
        method, startTime, params, error,
      });
      throw error;
    }
  };

  return putRecord;
};

module.exports = makePutRecord;
