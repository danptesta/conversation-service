const {
  InvalidPropertyError,
} = require('../../helpers/errors');

const findUnsupportedFields = ({ inputFields, supportedFieldSet }) => {
  const unsupportedFields = [];

  inputFields.forEach((field) => {
    if (!supportedFieldSet.has(field)) {
      unsupportedFields.push(field);
    }
  });

  return unsupportedFields;
};

const validateSupportedFields = ({ input, supportedFields }) => {
  const unsupportedFields = findUnsupportedFields({
    inputFields: Object.keys(input),
    supportedFieldSet: new Set(supportedFields),
  });

  if (unsupportedFields.length > 0) {
    throw new InvalidPropertyError(`Unsupported fields: ${unsupportedFields.join(', ')}`);
  }
};

module.exports = validateSupportedFields;
