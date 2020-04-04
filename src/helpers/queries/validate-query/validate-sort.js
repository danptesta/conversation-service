const { extractFieldFromObjectArray } = require('../../array-utils');
const {
  validateSupportedValues,
  validateNoDuplicates,
} = require('../../validators');

const validateSortKeys = ({ sort, supportedSortKeys }) => {
  const sortKeys = extractFieldFromObjectArray({ array: sort, field: 'key' });
  validateSupportedValues({
    field: 'sort key',
    values: sortKeys,
    supportedValues: supportedSortKeys,
  });

  validateNoDuplicates({ field: 'sort key', values: sortKeys });
};

const validateSortOrders = ({ sort, supportedSortOrders }) => {
  const sortOrders = extractFieldFromObjectArray({ array: sort, field: 'order' });
  validateSupportedValues({
    field: 'sort order',
    values: sortOrders,
    supportedValues: supportedSortOrders,
  });
};

const validateSort = ({ query, supportedSortKeys }) => {
  const { sort } = query;
  if (sort) {
    validateSortKeys({ sort, supportedSortKeys });
    validateSortOrders({ sort, supportedSortOrders: ['ascending', 'descending'] });
  }
};

module.exports = validateSort;
