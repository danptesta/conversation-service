const isSameOrigin = (origin1, origin2) => (origin1.alice === origin2.alice) && (origin1.bob === origin2.bob);

const getLastMutation = conversation => conversation.mutations[conversation.mutations.length - 1];

const isSameAuthor = (mutation1, mutation2) => mutation1.author === mutation2.author;

const isInsert = mutation => mutation.data.type === 'insert';

const isSameType = (mutation1, mutation2) => mutation1.data.type === mutation2.data.type;

// eslint-disable-next-line arrow-body-style
const isConflicting = (lastMutation, mutation) => {
  return (!isSameAuthor(lastMutation, mutation))
    && (isSameType(lastMutation, mutation))
    && (isSameOrigin(lastMutation, mutation));
};

const isConflictingInsert = (conversation, mutation) => {
  if (!isInsert(mutation)) return false;
  const lastMutation = getLastMutation(conversation);
  if (!lastMutation) return false;
  return isConflicting(lastMutation, mutation);
};

module.exports = {
  isSameOrigin,
  getLastMutation,
  isConflictingInsert,
};
