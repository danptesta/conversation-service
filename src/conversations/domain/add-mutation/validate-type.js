const { InvalidPropertyError } = require('../../../helpers/errors');

const validateInsertData = (data) => {
  if (data.length) {
    throw new InvalidPropertyError('length is not allowed on insert');
  }
};

const validateDeleteData = (data) => {
  if (data.text) {
    throw new InvalidPropertyError('text is not allowed on delete');
  }
};

const validateType = (mutation) => {
  const { data } = mutation;
  if (data.type === 'insert') {
    validateInsertData(data);
  } else {
    validateDeleteData(data);
  }
};

module.exports = validateType;
