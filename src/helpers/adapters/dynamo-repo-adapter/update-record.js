const makeUpdateRecord = ({
  putRecord,
}) => {
  const updateRecord = async (record) => {
    // dynamo db put operation replaces record with new one if it already exists
    await putRecord('updateRecord', record);
  };

  return updateRecord;
};

module.exports = makeUpdateRecord;
