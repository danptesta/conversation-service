const { getDynamoControlledFields } = require('./dynamo-controlled-fields');

const makeUpdateRecord = ({
  findRecordByIdUnfiltered,
  putRecord,
  idField,
}) => {
  const findDynamoControlledFields = async (id) => {
    const existingRecord = await findRecordByIdUnfiltered(id);
    if (!existingRecord) {
      throw new Error(`can't find existing record for ${idField} = ${id}`);
    }
    return getDynamoControlledFields(existingRecord);
  };

  const updateRecord = async (record) => {
    const dynamoControlledFields = await findDynamoControlledFields(record[idField]);
    // dynamo db put operation replaces record with new one if it already exists
    await putRecord('updateRecord', { ...record, ...dynamoControlledFields });
  };

  return updateRecord;
};

module.exports = makeUpdateRecord;
