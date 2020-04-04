const { RequiredParameterError } = require('../../helpers/errors');

const isValueMissing = (value) => {
  const missingFieldValues = new Set([undefined, null, '']);
  return missingFieldValues.has(value);
};

const findMissingFields = ({ input, fields }) => {
  const missingFields = [];

  fields.forEach((field) => {
    if (isValueMissing(input[field])) {
      missingFields.push(field);
    }
  });

  return missingFields;
};

const validateRequiredFields = ({ input, requiredFields }) => {
  if (!input) {
    throw new RequiredParameterError(requiredFields.join(', '));
  }

  const missingFields = findMissingFields({ input, fields: requiredFields });

  if (missingFields.length > 0) {
    throw new RequiredParameterError(missingFields.join(', '));
  }
};

module.exports = validateRequiredFields;
