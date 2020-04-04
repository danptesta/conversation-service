const recordHasKey = ({ record, key }) => Object.prototype.hasOwnProperty.call(record, key);

const recordHasKeys = ({ record, keys }) => {
  for (let i = 0; i < keys.length; i += 1) {
    if (!recordHasKey({ record, key: keys[i] })) return false;
  }
  return true;
};

const createKeyValuePair = ({ key, value }) => {
  const result = {};
  result[key] = value;
  return result;
};

const createCompositeIndexKey = ({ keys, fieldSeparator }) => keys.join(fieldSeparator);

const createCompositeIndexValue = ({ record, keys, fieldSeparator }) => {
  const values = [];

  for (let i = 0; i < keys.length; i += 1) {
    values.push(record[keys[i]]);
  }

  return values.join(fieldSeparator);
};

const createCompositeIndexField = ({ record, keys, fieldSeparator }) => createKeyValuePair({
  key: createCompositeIndexKey({ keys, fieldSeparator }),
  value: createCompositeIndexValue({ record, keys, fieldSeparator }),
});

const addCompositeIndexFields = ({ record, compositeIndexKeys, fieldSeparator }) => {
  let result = { ...record };

  compositeIndexKeys.forEach((keys) => {
    if (recordHasKeys({ record, keys })) {
      const compositeIndexField = createCompositeIndexField({ record, keys, fieldSeparator });
      result = { ...result, ...compositeIndexField };
    }
  });

  return result;
};

module.exports = addCompositeIndexFields;
