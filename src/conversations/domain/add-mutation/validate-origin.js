const { InvalidPropertyError } = require('../../../helpers/errors');
const { getCurrentState } = require('./state');

const isOriginOutOfBounds = ({ mutations, mutation }) => {
  const currentState = getCurrentState(mutations);
  const { origin } = mutation;
  return (origin.alice > currentState.alice) || (origin.bob > currentState.bob);
};

const isInitialOriginOnExistingConversation = ({ mutations, mutation }) => {
  const { origin } = mutation;
  return origin.alice === 0 && origin.bob === 0 && mutations.length > 0;
}

const validateOrigin = ({ mutations, mutation }) => {
  if (isOriginOutOfBounds({ mutations, mutation })) {
    throw new InvalidPropertyError('origin out of bounds');
  }
  if (isInitialOriginOnExistingConversation({ mutations, mutation })) {
    throw new InvalidPropertyError('cannot use origin (0,0) on existing conversation');
  }
};

module.exports = validateOrigin;
