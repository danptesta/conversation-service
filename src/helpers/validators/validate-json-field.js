const sizeof = require('object-sizeof');
const {
  InvalidPropertyError,
} = require('../errors');

const haveValue = value => value !== undefined && value !== null;
const isJsonCompatibleFormat = value => typeof value === 'object';

const validateJsonCompatibleFormat = ({ field, value }) => {
  if (!isJsonCompatibleFormat(value)) {
    throw new InvalidPropertyError(`${field} must be JSON format`);
  }
};

const isValueWithinMaxByteSize = ({ value, maxByteSize }) => sizeof(value) <= maxByteSize;

const validateWithinMaxByteSize = ({ field, value, maxByteSize }) => {
  if (!isValueWithinMaxByteSize({ value, maxByteSize })) {
    throw new InvalidPropertyError(`${field} size must be <= ${maxByteSize} bytes`);
  }
};

const validateJsonField = ({ field, value, maxByteSize = 3072 }) => {
  if (haveValue(value)) {
    validateJsonCompatibleFormat({ field, value });
    validateWithinMaxByteSize({ field, value, maxByteSize });
  }
};

module.exports = validateJsonField;
