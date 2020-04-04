const _ = require('lodash');
const {
  RequiredParameterError,
  InvalidPropertyError,
} = require('../../errors');

const hasCriteria = criteria => criteria && Object.keys(criteria).length > 0;

const validateHasCriteria = (criteria) => {
  if (!hasCriteria(criteria)) {
    throw new RequiredParameterError('Query must have at least one criteria field.');
  }
};

const isSupportedCriteria = ({ criteriaKeys, supportedCriteria }) => {
  const fieldSet = new Set(criteriaKeys);
  for (let i = 0; i < supportedCriteria.length; i += 1) {
    if (_.isEqual(fieldSet, new Set(supportedCriteria[i]))) return true;
  }
  return false;
};

const validateSupportedCriteria = ({ criteria, supportedCriteria }) => {
  const criteriaKeys = Object.keys(criteria);
  if (!isSupportedCriteria({ criteriaKeys, supportedCriteria })) {
    throw new InvalidPropertyError(
      `Unsupported criteria: ${criteriaKeys.join(', ')}.`
      + ` Supported criteria include: ${supportedCriteria.join(' | ')}`
    );
  }
};

const validateCriteria = ({ query, supportedCriteria }) => {
  const { criteria } = query;
  validateHasCriteria(criteria);
  validateSupportedCriteria({ criteria, supportedCriteria });
};

module.exports = validateCriteria;
