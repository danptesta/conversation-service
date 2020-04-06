const { InvalidPropertyError } = require('../../helpers/errors');

const validateInsertNoLength = (data) => {
  if (data.length) {
    throw new InvalidPropertyError('length is not allowed on insert');
  }
};

const validateInsertIndexInRange = (currentText, data) => {
  if (data.index > currentText.length) {
    throw new InvalidPropertyError('index is out of range');
  }
};

const validateInsert = (currentText, data) => {
  validateInsertNoLength(data);
  validateInsertIndexInRange(currentText, data);
};

const validateDelete = (data) => {
  if (data.text) {
    throw new InvalidPropertyError('text is not allowed on delete');
  }
};

const validateType = (currentText, { data }) => {
  if (data.type === 'insert') {
    validateInsert(currentText, data);
  } else {
    validateDelete(data);
  }
};

module.exports = validateType;
