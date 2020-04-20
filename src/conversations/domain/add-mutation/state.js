/* eslint-disable arrow-body-style */
const getState = ({ author, origin }) => {
  const result = { ...origin };
  result[author] += 1;
  return result;
};

const INITIAL_STATE = { bob: 0, alice: 0 };

const getCurrentState = (mutations) => {
  return (mutations.length === 0)
    ? INITIAL_STATE
    : getState(mutations[mutations.length - 1]);
};

module.exports = { getState, getCurrentState };
