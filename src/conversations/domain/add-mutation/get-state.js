const getState = ({ author, origin }) => {
  const result = { ...origin };
  result[author] += 1;
  return result;
};

module.exports = getState;
