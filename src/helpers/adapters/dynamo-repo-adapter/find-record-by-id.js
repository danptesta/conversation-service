const makeFindRecordById = ({
  tableName,
  docClient,
  logger,
  idField,
}) => {
  const findRecordById = async (id) => {
    const Key = {};
    Key[idField] = id;
    const params = {
      TableName: tableName,
      Key,
    };

    const startTime = Date.now();
    try {
      const response = await docClient.get(params).promise();
      logger.logDynamoResponse({
        method: 'findRecordById', startTime, params, response,
      });

      if (response && response.Item) {
        return Object.freeze({ ...response.Item });
      }
      return null;
    } catch (error) {
      logger.logDynamoError({
        method: 'findRecordById', startTime, params, error,
      });
      throw error;
    }
  };

  return findRecordById;
};

module.exports = makeFindRecordById;
