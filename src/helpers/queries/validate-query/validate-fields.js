const {
  validateSupportedValues,
  validateNoDuplicates,
} = require('../../validators');
const haveLimit = require('./have-limit');
const { InvalidPropertyError } = require('../../errors');

const haveCount = ({ fields }) => fields[0] === 'count';

const validateNoLimitWithCount = (query) => {
  if (haveCount(query) && haveLimit(query)) {
    throw new InvalidPropertyError('limit cannot be used when selecting count');
  }
};

const validateFields = ({ query, supportedFields }) => {
  const { fields } = query;
  if (fields) {
    validateSupportedValues({
      field: 'fields',
      values: fields,
      supportedValues: supportedFields,
    });
    validateNoDuplicates({ field: 'fields', values: fields });
    validateNoLimitWithCount(query);
  }
};

module.exports = validateFields;
