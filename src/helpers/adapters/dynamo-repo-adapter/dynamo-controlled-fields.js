const dynamoControlledFields = [
  'aws:rep:deleting', 'aws:rep:updatetime', 'aws:rep:updateregion', 'ttl',
];

const getDynamoControlledFields = (record) => {
  const result = {};
  dynamoControlledFields.forEach((field) => {
    if (record[field]) result[field] = record[field];
  });
  return result;
};

const removeDynamoControlledFields = (record) => {
  const result = { ...record };
  dynamoControlledFields.forEach((field) => { delete result[field]; });
  return result;
};

module.exports = {
  getDynamoControlledFields,
  removeDynamoControlledFields,
};
