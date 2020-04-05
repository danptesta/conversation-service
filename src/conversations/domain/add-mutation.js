const { InvalidPropertyError } = require('../../helpers/errors');

const validateInsertType = (data) => {
  if (data.length) {
    throw new InvalidPropertyError('length is not allowed on insert');
  }
};

const validateDeleteType = (data) => {
  if (data.text) {
    throw new InvalidPropertyError('text is not allowed on delete');
  }
};

const validateType = ({ data }) => {
  if (data.type === 'insert') {
    validateInsertType(data);
  } else {
    validateDeleteType(data);
  }
};

const validate = (input) => {
  validateType(input);
};

const addMutation = (input) => {
  validate(input);
};

module.exports = addMutation;
