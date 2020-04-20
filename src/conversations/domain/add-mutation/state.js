/* eslint-disable arrow-body-style */
const INITIAL_STATE = { bob: 0, alice: 0 };

const getState = ({ author, origin }) => {
  const result = { ...origin };
  result[author] += 1;
  return result;
};

const getPreviousState = ({ author, origin }) => {
  const result = { ...origin };
  if (result[author] > 0) {
    result[author] -= 1;
  }
  return result;
};

const getCurrentState = (mutations) => {
  return (mutations.length === 0)
    ? INITIAL_STATE
    : getState(mutations[mutations.length - 1]);
};

const isSameState = (state1, state2) => {
  return state1.alice === state2.alice && state1.bob === state2.bob;
};

module.exports = {
  getState,
  getPreviousState,
  getCurrentState,
  isSameState,
};
