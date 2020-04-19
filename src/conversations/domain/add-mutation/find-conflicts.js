/* eslint-disable arrow-body-style */
const getState = require('./get-state');
const { InvalidPropertyError } = require('../../../helpers/errors');

const originMatchesState = ({ origin, state }) => {
  return origin.alice === state.alice && origin.bob === state.bob;
};

const findMatchingState = ({ mutations, mutation }) => {
  if (mutations.length === 0) {
    if (mutation.origin.bob !== 0 || mutation.origin.alice !== 0) {
      throw new InvalidPropertyError('invalid origin');
    }
    return 0;
  }

  for (let i = mutations.length - 1; i >= 0; i -= 1) {
    if (originMatchesState({ origin: mutation.origin, state: getState(mutations[i]) })) {
      return i + 1;
    }
  }
  throw new InvalidPropertyError('invalid origin');
};

const findConflicts = ({ mutations, mutation }) => {
  const index = findMatchingState({ mutations, mutation });
  return (index === mutations.length ? [] : mutations.slice(index));
};

module.exports = findConflicts;
