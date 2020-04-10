const { InvalidPropertyError } = require('../../../helpers/errors');
const { isSameState } = require('./state');

const validateCurrentState = (conversation, mutation) => {
  if (!isSameState(conversation, mutation)) {
    throw new InvalidPropertyError('origin does not match current state');
  }
};

module.exports = validateCurrentState;
