const { getState } = require('./state');

// eslint-disable-next-line arrow-body-style
const originMatchesState = ({ origin, state }) => {
  return origin.alice === state.alice && origin.bob === state.bob;
};

const findFirstConflictBetweenAuthorsIndex = ({ mutations, mutation }) => {
  for (let i = mutations.length - 1; i > 0; i -= 1) {
    if (originMatchesState({ origin: mutation.origin, state: getState(mutations[i]) })) {
      return i + 1;
    }
  }
  return 1;
};

const isConflict = ({ mutation, lastMutation }) => {
  const state = getState(lastMutation);
  const { origin } = mutation;
  return origin.alice !== state.alice || origin.bob !== state.bob;
};

const findFirstConflictIndexFromSameAuthor = ({ mutation, mutations }) => {
  const lastMutationIndex = mutations.length - 1;
  const lastMutation = mutations[lastMutationIndex];
  return isConflict({ mutation, lastMutation })
    ? lastMutationIndex
    : mutations.length;
};

const findFirstConflictIndex = ({ mutations, mutation }) => {
  if (mutations.length === 0) {
    return 0;
  }

  const lastMutation = mutations[mutations.length - 1];
  if (mutation.author === lastMutation.author) {
    return findFirstConflictIndexFromSameAuthor({ mutation, mutations });
  }

  return findFirstConflictBetweenAuthorsIndex({ mutations, mutation });
};

const findConflicts = ({ mutations, mutation }) => {
  const index = findFirstConflictIndex({ mutations, mutation });
  return (index === mutations.length ? [] : mutations.slice(index));
};

module.exports = findConflicts;
