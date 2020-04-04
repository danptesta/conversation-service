const { createIndexQuery } = require('./dynamo-index-utils');

const makeCountRecords = ({
  tableName,
  docClient,
  logger,
}) => {
  const countRecords = async ({ criteria }) => {
    let exclusiveStartKey = null;
    let count = 0;
    const params = createIndexQuery({ tableName, criteria });
    params.Select = 'COUNT';

    do {
      if (exclusiveStartKey) {
        params.ExclusiveStartKey = exclusiveStartKey;
      }

      const startTime = Date.now();
      try {
        // eslint-disable-next-line no-await-in-loop
        const response = await docClient.query(params).promise();
        logger.logDynamoResponse({
          method: 'countRecords', startTime, params, response,
        });

        if (response) {
          count += response.Count;
          exclusiveStartKey = response.LastEvaluatedKey;
        }
      } catch (error) {
        logger.logDynamoError({
          method: 'countRecords', startTime, params, error,
        });
        throw error;
      }
    } while (exclusiveStartKey);

    return count;
  };

  return countRecords;
};

module.exports = makeCountRecords;
