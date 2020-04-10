/* eslint-disable arrow-body-style */
const getStateFromLastMutation = ({ author, origin }) => {
  const result = { ...origin };
  result[author] += 1;
  return result;
};

const getState = ({ lastMutation }) => {
  return lastMutation
    ? getStateFromLastMutation(lastMutation)
    : { alice: 0, bob: 0 };
};

const isConflictingState = (conversation, mutation) => {
  const { lastMutation } = conversation;
  const state = getState(conversation);
  return lastMutation.author !== mutation.author
    && (mutation.origin[mutation.author] === state[mutation.author])
    && (mutation.origin[lastMutation.author] === (state[lastMutation.author] - 1));
};

const isConflictingInsert = (conversation, mutation) => {
  return mutation.data.type === 'insert'
    && conversation.lastMutation
    && conversation.lastMutation.data.type === 'insert'
    && isConflictingState(conversation, mutation);
};

const isSameOrigin = (origin1, origin2) => (origin1.alice === origin2.alice) && (origin1.bob === origin2.bob);

const isSameState = (conversation, mutation) => {
  if (isConflictingInsert(conversation, mutation)) return true;
  return isSameOrigin(getState(conversation), mutation.origin);
};

module.exports = {
  getState,
  isConflictingInsert,
  isSameState,
};
