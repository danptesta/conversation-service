/* eslint-disable arrow-body-style */
const { InvalidPropertyError } = require('../../../helpers/errors');

const compareState = ({ index, existing, mutation }) => {
  let result = -1;

  if (mutation.author === 'alice') {
    if (existing.author === 'alice') {
      if (existing.origin.alice !== (mutation.origin.alice - 1)) {
        throw new Error('state mismatch');
      }
      if (existing.origin.bob === (mutation.origin.bob - 1)) {
        result = index;
      } else if (existing.origin.bob === mutation.origin.bob) {
        result = index + 1;
      }
    }
  } else if (mutation.author === 'bob') {
    if (existing.author === 'bob') {
      if (existing.origin.bob !== (mutation.origin.bob - 1)) {
        throw new InvalidPropertyError('invalid origin');
      }
      if (existing.origin.alice === (mutation.origin.alice - 1)) {
        result = index;
      } else if (existing.origin.alice === mutation.origin.alice) {
        result = index + 1;
      }
    }
  }

  return result;
};

const findMatchingState = ({ mutations, mutation }) => {
  if (mutations.length === 0) {
    if (mutation.origin.bob !== 0 || mutation.origin.alice !== 0) {
      throw new InvalidPropertyError('invalid origin');
    }
    return 0;
  }

  for (let i = 0; i < mutations.length; i += 1) {
    const result = compareState({
      index: i,
      existing: mutations[i],
      mutation,
    });
    if (result !== -1) return result;
  }
  throw new InvalidPropertyError('invalid origin');
};

const findConflicts = ({ mutations, mutation }) => {
  // mutations are ordered from oldest to newest
  // we want to look for and return conflicts starting from newest to oldest
  const reversed = mutations.reverse();
  const index = findMatchingState({ mutations: reversed, mutation });
  return reversed.slice(0, index);
};

module.exports = findConflicts;
