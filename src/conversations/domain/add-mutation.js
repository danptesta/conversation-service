const {
  validateRequiredFields,
  validateSupportedFields,
} = require('../../helpers/validators');

const requiredFields = ['author', 'data', 'origin'];
const supportedFields = ['author', 'data', 'origin'];

const validate = (input) => {
  validateRequiredFields({ input, requiredFields });
  validateSupportedFields({ input, supportedFields });
};

const addMutation = (input) => {
  validate(input);
};

module.exports = addMutation;
