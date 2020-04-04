const validateQuery = require('./validate-query');

const isCountQuery = ({ fields }) => fields && fields[0] === 'count';

const countRecords = async ({ query, repository }) => repository.countRecords({ criteria: query.criteria });

const normalizeQuery = ({
  criteria,
  limit = 10,
  fields = [],
  sort = [{ key: 'createdRaw', order: 'ascending' }],
}) => ({
  criteria,
  limit,
  fields,
  sort,
});

const findRecords2 = async ({ query, repository }) => {
  const normalizedQuery = normalizeQuery(query);
  return repository.findRecords(normalizedQuery);
};

const findRecords = async ({
  query,
  repository,
  supportedCriteria,
  supportedFields = ['count'],
  supportedSortKeys = ['createdRaw'],
}) => {
  validateQuery({
    query,
    supportedCriteria,
    supportedFields,
    supportedSortKeys,
  });
  if (isCountQuery(query)) {
    return countRecords({ query, repository });
  }
  return findRecords2({ query, repository });
};

module.exports = findRecords;
