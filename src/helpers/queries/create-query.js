const parseSortKey = token => ((token.startsWith('+') || token.startsWith('-')) ? token.substring(1) : token);

const parseSortOrder = token => (token.startsWith('-') ? 'descending' : 'ascending');

const parseSortToken = token => ({ key: parseSortKey(token), order: parseSortOrder(token) });

const parseSortTokens = (sort) => {
  const result = [];
  const tokens = sort.split(',');
  tokens.forEach(token => result.push(parseSortToken(token)));
  return result;
};

const createQuery = ({
  limit, fields, sort, ...criteria
}) => {
  const result = { criteria };
  if (limit) {
    result.limit = parseInt(limit, 10);
  }
  if (fields) {
    result.fields = fields.split(',');
  }
  if (sort) {
    result.sort = parseSortTokens(sort);
  }
  return result;
};

module.exports = createQuery;
