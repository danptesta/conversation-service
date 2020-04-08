const isConflictingState = (conversation, mutation) => {
  const { lastMutation, state } = conversation;
  return lastMutation.author !== mutation.author
    && (mutation.origin[mutation.author] === state[mutation.author])
    && (mutation.origin[lastMutation.author] === (state[lastMutation.author] - 1));
};

// eslint-disable-next-line arrow-body-style
const isConflictingInsert = (conversation, mutation) => {
  return mutation.data.type === 'insert'
    && conversation.lastMutation
    && conversation.lastMutation.data.type === 'insert'
    && isConflictingState(conversation, mutation);
};

module.exports = isConflictingInsert;
