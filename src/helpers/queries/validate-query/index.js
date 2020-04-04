const validateCriteria = require('./validate-criteria');
const validateLimit = require('./validate-limit');
const validateFields = require('./validate-fields');
const validateSort = require('./validate-sort');
const { RequiredParameterError } = require('../../errors');

const validateQueryExists = (query) => {
  if (!query) {
    throw new RequiredParameterError('Query must have at least one criteria field.');
  }
};

const validateQuery = ({
  query,
  supportedCriteria,
  supportedFields,
  supportedSortKeys,
}) => {
  validateQueryExists(query);
  validateCriteria({ query, supportedCriteria });
  validateLimit(query);
  validateFields({ query, supportedFields });
  validateSort({ query, supportedSortKeys });
};

module.exports = validateQuery;
