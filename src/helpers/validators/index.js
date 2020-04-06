const validateNumberAtLeastOne = require('./validate-number-at-least-one');
const validateRequiredFields = require('./validate-required-fields');
const validateSupportedFields = require('./validate-supported-fields');
const validateNoDuplicates = require('./validate-no-duplicates');
const validateSupportedValues = require('./validate-supported-values');
const validateJson = require('./validate-json');

module.exports = {
  validateNumberAtLeastOne,
  validateRequiredFields,
  validateSupportedFields,
  validateNoDuplicates,
  validateSupportedValues,
  validateJson,
};
