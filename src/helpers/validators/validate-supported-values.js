const {
  InvalidPropertyError,
} = require('../errors');

const hasUnsupportedValues = ({ values, supportedValues }) => {
  const unsupportedValues = values.filter(value => !supportedValues.includes(value));
  return unsupportedValues.length > 0;
};

const validateSupportedValues = ({ field, values, supportedValues }) => {
  if (hasUnsupportedValues({ values, supportedValues })) {
    throw new InvalidPropertyError(`${field} must be one of these values: ${supportedValues.join(', ')}`);
  }
};

module.exports = validateSupportedValues;
