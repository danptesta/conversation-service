const _ = require('lodash');
const { InvalidPropertyError } = require('../../helpers/errors');

const isSameOrigin = (origin1, origin2) => (origin1.alice === origin2.alice) && (origin1.bob === origin2.bob);

const isNewConversation = conversation => conversation.mutations.length === 0;

const getLastMutation = conversation => conversation.mutations[conversation.mutations.length - 1];

const hasPreviousMutation = (conversation, author) => {
  const mutation = _.find(conversation.mutations, { author });
  return mutation;
};

const calculateCurrentState = (conversation, author) => {
  const lastMutation = getLastMutation(conversation);
  const result = { ...lastMutation.origin };
  result[author] = hasPreviousMutation(conversation, author) ? result[author] + 1 : 0;
  if (lastMutation.author !== author) {
    result[lastMutation.author] += 1;
  }
  return result;
};

// eslint-disable-next-line arrow-body-style
const getCurrentState = (conversation, author) => {
  return isNewConversation(conversation)
    ? { alice: 0, bob: 0 }
    : calculateCurrentState(conversation, author);
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
