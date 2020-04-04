const extractFieldFromObjectArray = ({ array, field }) => array.map(object => object[field]);

const hasDuplicateValues = (array) => {
  const uniqueValues = new Set(array);
  return array.length > uniqueValues.size;
};

module.exports = { extractFieldFromObjectArray, hasDuplicateValues };
