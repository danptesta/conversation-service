const {
  getState,
  getPreviousState,
  isSameState,
} = require('./state');

const findLastMatchingMutationIndex = ({ mutations, mutation }) => {
  const previousState = getPreviousState(mutation);
  for (let i = mutations.length - 1; i > 0; i -= 1) {
    const existingMutationState = getState(mutations[i]);
    if (isSameState(mutation.origin, existingMutationState)
      || isSameState(previousState, existingMutationState)) {
      return i;
    }
  }
  return 0;
};

const findFirstConflictIndex = ({ mutations, mutation }) => {
  if (mutations.length === 0) {
    return 0;
  }
  return findLastMatchingMutationIndex({ mutations, mutation }) + 1;
};

const findConflicts = ({ mutations, mutation }) => {
  const index = findFirstConflictIndex({ mutations, mutation });
  return (index === mutations.length ? [] : mutations.slice(index));
};

module.exports = findConflicts;
