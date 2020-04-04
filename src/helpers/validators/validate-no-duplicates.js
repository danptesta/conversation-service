const { hasDuplicateValues } = require('../array-utils');
const {
  InvalidPropertyError,
} = require('../errors');

const validateNoDuplicateValues = ({ field, values }) => {
  if (hasDuplicateValues(values)) {
    throw new InvalidPropertyError(`Duplicate ${field} values are not allowed.`);
  }
};

module.exports = validateNoDuplicateValues;
