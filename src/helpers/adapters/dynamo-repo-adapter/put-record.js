const { addCompositeIndexFields } = require('./dynamo-index-utils');

const makePutRecord = ({
  tableName,
  docClient,
  logger,
  compositeIndexKeys,
}) => {
  const putRecord = async (method, record) => {
    const params = {
      TableName: tableName,
      Item: addCompositeIndexFields({ record, compositeIndexKeys }),
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
