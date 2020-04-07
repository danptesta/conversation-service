const { removeCompositeIndexFields } = require('./dynamo-index-utils');
const { removeDynamoControlledFields } = require('./dynamo-controlled-fields');

const makeListRecords = ({
  tableName,
  docClient,
  logger,
  compositeIndexKeys,
}) => {
  const listRecords = async () => {
    const params = {
      TableName: tableName,
    };

    const startTime = Date.now();
    try {
      const response = await docClient.scan(params).promise();
      logger.logDynamoResponse({
        method: 'listRecords', startTime, params, response,
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
        method: 'listRecords', startTime, params, error,
      });
      throw error;
    }
  };

  return listRecords;
};

module.exports = makeListRecords;
