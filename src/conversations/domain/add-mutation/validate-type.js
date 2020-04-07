const { InvalidPropertyError } = require('../../../helpers/errors');

const validateInsertFields = (data) => {
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
  validateInsertFields(data);
  validateInsertIndexInRange(currentText, data);
};

const validateDelete = (data) => {
  if (data.text) {
    throw new InvalidPropertyError('text is not allowed on delete');
  }
};

const validateType = (conversation, mutation) => {
  const { data } = mutation;
  if (data.type === 'insert') {
    validateInsert(conversation.text, data);
  } else {
    validateDelete(data);
  }
};

module.exports = validateType;
