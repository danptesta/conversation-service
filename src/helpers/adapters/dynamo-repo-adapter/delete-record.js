const { EntityNotFoundError } = require('../../errors');

const makeDeleteRecord = ({
  tableName,
  docClient,
  logger,
  idField,
}) => {
  const deleteRecord = async (id) => {
    const Key = {};
    Key[idField] = id;
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
      throw new EntityNotFoundError('record');
    }
  };

  return deleteRecord;
};

module.exports = makeDeleteRecord;
