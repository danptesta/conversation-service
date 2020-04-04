const { removeDynamoControlledFields } = require('./dynamo-controlled-fields');
const { removeCompositeIndexFields } = require('./dynamo-index-utils');

const makeFindRecordById = ({
  tableName,
  docClient,
  logger,
  idField,
  compositeIndexKeys,
}) => {
  const findRecordByIdUnfiltered = async (id) => {
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
        return Object.freeze(
          removeCompositeIndexFields({
            record: { ...response.Item },
            compositeIndexKeys,
          })
        );
      }
      return null;
    } catch (error) {
      logger.logDynamoError({
        method: 'findRecordById', startTime, params, error,
      });
      throw error;
    }
  };

  const findRecordById = async (id) => {
    const record = await findRecordByIdUnfiltered(id);
    return record ? Object.freeze(removeDynamoControlledFields(record)) : null;
  };

  return { findRecordById, findRecordByIdUnfiltered };
};

module.exports = makeFindRecordById;
