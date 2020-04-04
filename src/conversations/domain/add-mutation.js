const {
  validateRequiredFields,
  validateSupportedFields,
  validateSupportedValues,
} = require('../../helpers/validators');

const requiredFields = ['author', 'data', 'origin'];
const supportedFields = ['author', 'data', 'origin'];

const validateAuthor = ({ author }) => validateSupportedValues({
  field: 'author',
  values: [author],
  supportedValues: ['alice', 'bob'],
});

const validate = (input) => {
  validateRequiredFields({ input, requiredFields });
  validateSupportedFields({ input, supportedFields });
  validateAuthor(input);
};

const addMutation = (input) => {
  validate(input);
};

module.exports = addMutation;
