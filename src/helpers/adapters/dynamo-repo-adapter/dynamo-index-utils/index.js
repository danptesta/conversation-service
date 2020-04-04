
const addCompositeIndexFields = require('./add-composite-index-fields');
const removeCompositeIndexFields = require('./remove-composite-index-fields');
const createIndexQuery = require('./create-index-query');

const fieldSeparator = '_';

module.exports = {
  addCompositeIndexFields: ({ record, compositeIndexKeys }) => addCompositeIndexFields({ record, compositeIndexKeys, fieldSeparator }),
  removeCompositeIndexFields: ({ record, compositeIndexKeys }) => removeCompositeIndexFields({ record, compositeIndexKeys, fieldSeparator }),
  createIndexQuery: ({ tableName, criteria, sortOrder }) => createIndexQuery({
    tableName, criteria, fieldSeparator, sortOrder,
  }),
};
