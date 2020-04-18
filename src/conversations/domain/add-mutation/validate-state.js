const { InvalidPropertyError } = require('../../../helpers/errors');
const { isSameState } = require('./state');

const validateState = (lastMutation, mutation) => {
  if (!isSameState(lastMutation, mutation)) {
    throw new InvalidPropertyError('origin does not match current state');
  }
};

module.exports = validateState;
