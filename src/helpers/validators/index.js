const validateStateChange = require('./validate-state-change');
const validateNumberAtLeastOne = require('./validate-number-at-least-one');
const validateRequiredFields = require('./validate-required-fields');
const validateSupportedFields = require('./validate-supported-fields');
const validateNoDuplicates = require('./validate-no-duplicates');
const validateSupportedValues = require('./validate-supported-values');
const validateJsonField = require('./validate-json-field');
const validateJson = require('./validate-json');

module.exports = {
  validateStateChange,
  validateNumberAtLeastOne,
  validateRequiredFields,
  validateSupportedFields,
  validateNoDuplicates,
  validateSupportedValues,
  validateJsonField,
  validateJson,
};
