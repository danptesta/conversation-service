const makeInsertRecord = ({
  putRecord,
}) => {
  const insertRecord = async (record) => {
    await putRecord('insertRecord', record);
  };

  return insertRecord;
};

module.exports = makeInsertRecord;
