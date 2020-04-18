/* eslint-disable arrow-body-style */
const getStateFromLastMutation = ({ author, origin }) => {
  const result = { ...origin };
  result[author] += 1;
  return result;
};

const getState = (lastMutation) => {
  return lastMutation
    ? getStateFromLastMutation(lastMutation)
    : { alice: 0, bob: 0 };
};

const isLastMutationConflicting = (lastMutation, mutation) => {
  const state = getState(lastMutation);
  return lastMutation.author !== mutation.author
    && (mutation.origin[mutation.author] === state[mutation.author])
    && (mutation.origin[lastMutation.author] === (state[lastMutation.author] - 1));
};

const isConflictingState = (lastMutation, mutation) => {
  return lastMutation
    ? isLastMutationConflicting(lastMutation, mutation)
    : false; // no conflict if there is no previous mutation
};

const isSameOrigin = (origin1, origin2) => (origin1.alice === origin2.alice) && (origin1.bob === origin2.bob);

const isSameState = (lastMutation, mutation) => {
  return (isConflictingState(lastMutation, mutation))
    ? true
    : isSameOrigin(getState(lastMutation), mutation.origin);
};

module.exports = {
  getState,
  isConflictingState,
  isSameState,
};
