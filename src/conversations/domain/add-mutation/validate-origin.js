const { InvalidPropertyError } = require('../../../helpers/errors');
const { getCurrentState } = require('./state');

const isOriginOutOfBounds = ({ mutations, mutation }) => {
  const currentState = getCurrentState(mutations);
  const { origin } = mutation;
  return (origin.alice > currentState.alice) || (origin.bob > currentState.bob);
};

const validateOrigin = ({ mutations, mutation }) => {
  if (isOriginOutOfBounds({ mutations, mutation })) {
    throw new InvalidPropertyError('origin out of bounds');
  }
};

module.exports = validateOrigin;
