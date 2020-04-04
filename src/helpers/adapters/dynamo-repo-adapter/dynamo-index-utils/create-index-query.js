const getKeys = criteria => Object.keys(criteria).sort();
const createIndexKey = ({ criteria, fieldSeparator }) => getKeys(criteria).join(fieldSeparator);

const createIndexValue = ({ criteria, fieldSeparator }) => {
  const keys = getKeys(criteria);
  const values = [];
  keys.forEach(key => values.push(criteria[key]));
  return values.join(fieldSeparator);
};

const createIndexQuery = ({
  tableName, criteria, fieldSeparator, sortOrder,
}) => {
  const indexKey = createIndexKey({ criteria, fieldSeparator });
  const result = {
    TableName: tableName,
    IndexName: `idx_${indexKey}`,
    KeyConditionExpression: `${indexKey} = :${indexKey}`,
    ExpressionAttributeValues: {
    },
    ScanIndexForward: sortOrder === 'ascending',
  };
  result.ExpressionAttributeValues[`:${indexKey}`] = createIndexValue({ criteria, fieldSeparator });

  return result;
};

module.exports = createIndexQuery;
