const { InvalidPropertyError } = require('../../helpers/errors');

const isSameOrigin = (origin1, origin2) => (origin1.alice === origin2.alice) && (origin1.bob === origin2.bob);

const isNewConversation = conversation => conversation.mutations.length === 0;

const getLastMutation = conversation => conversation.mutations[conversation.mutations.length - 1];

// eslint-disable-next-line arrow-body-style
const getLastOrigin = (conversation) => {
  return isNewConversation(conversation)
    ? { alice: 0, bob: 0 }
    : getLastMutation(conversation).origin;
};

const getCurrentState = (conversation, author) => {
  const result = getLastOrigin(conversation);
  result[author] += 1;
  return result;
};

const isCurrentState = (conversation, mutation) => {
  const currentState = getCurrentState(conversation, mutation.author);
  return isSameOrigin(currentState, mutation.origin);
};

const validateCurrentState = (conversation, mutation) => {
  if (!isCurrentState(conversation, mutation)) {
    throw new InvalidPropertyError('origin does not match current state');
  }
};

const validateOrigin = (conversation, mutation) => {
  validateCurrentState(conversation, mutation);
};

module.exports = validateOrigin;
