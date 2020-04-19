const makeFindRecordsById = ({
  tableName,
  docClient,
  logger,
  partitionKey,
}) => {
  const createParams = (id) => {
    const result = {
      TableName: tableName,
      KeyConditionExpression: `${partitionKey} = :${partitionKey}`,
      ExpressionAttributeValues: {},
    };
    result.ExpressionAttributeValues[`:${partitionKey}`] = id;
    return result;
  };

  const findRecordsById = async (id) => {
    const params = createParams(id);
    const startTime = Date.now();
    try {
      const response = await docClient.query(params).promise();
      logger.logDynamoResponse({
        method: 'findRecordsById', startTime, params, response,
      });

      if (response && response.Items) {
        return response.Items;
      }
      return [];
    } catch (error) {
      logger.logDynamoError({
        method: 'findRecordsById', startTime, params, error,
      });
      throw error;
    }
  };

  return findRecordsById;
};

module.exports = makeFindRecordsById;
