const haveLimit = require('./have-limit');
const { validateNumberAtLeastOne } = require('../../validators');

const validateLimit = (query) => {
  if (haveLimit(query)) {
    validateNumberAtLeastOne({ field: 'limit', value: query.limit });
  }
};

module.exports = validateLimit;
