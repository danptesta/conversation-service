const { createIndexQuery, removeCompositeIndexFields } = require('./dynamo-index-utils');
const { removeDynamoControlledFields } = require('./dynamo-controlled-fields');

const makeFindRecords = ({
  tableName,
  docClient,
  logger,
  compositeIndexKeys,
}) => {
  const findRecords = async (query) => {
    const params = createIndexQuery({ tableName, criteria: query.criteria, sortOrder: query.sort[0].order });
    params.Limit = query.limit;

    const startTime = Date.now();
    try {
      const response = await docClient.query(params).promise();
      logger.logDynamoResponse({
        method: 'findRecords', startTime, params, response,
      });

      if (response && response.Count > 0) {
        return response.Items.map(record => Object.freeze(
          removeCompositeIndexFields({
            record: removeDynamoControlledFields(record),
            compositeIndexKeys,
          })
        ));
      }
      return [];
    } catch (error) {
      logger.logDynamoError({
        method: 'findRecords', startTime, params, error,
      });
      throw error;
    }
  };

  return findRecords;
};

module.exports = makeFindRecords;
