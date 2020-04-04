const createCompositeIndexKey = ({ keys, fieldSeparator }) => keys.join(fieldSeparator);

const removeCompositeIndexFields = ({ record, compositeIndexKeys, fieldSeparator }) => {
  const result = { ...record };

  compositeIndexKeys.forEach((keys) => {
    delete result[createCompositeIndexKey({ keys, fieldSeparator })];
  });

  return result;
};

module.exports = removeCompositeIndexFields;
