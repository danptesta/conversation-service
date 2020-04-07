const _ = require('lodash');

const makeMemoryRepo = ({
  idField,
  seedData = [],
}) => {
  const records = seedData;

  const insertRecord = async (record) => {
    records.push(record);
  };

  const findRecordById = async (id) => {
    const predicate = {};
    predicate[idField] = id;
    const doc = _.find(records, predicate);
    return doc || null;
  };

  const updateRecord = async (record) => {
    for (let i = 0; i < records.length; i += 1) {
      if (records[i][idField] === record[idField]) {
        records[i] = record;
      }
    }
  };

  const generateId = () => `record${records.length + 1}`;

  const findMatchingRecords = async (criteria) => {
    const result = records.filter((record) => {
      const criteriaEntries = Object.entries(criteria);
      const matches = criteriaEntries.filter(([key, value]) => record[key] === value);
      return matches.length === criteriaEntries.length;
    });

    return result;
  };

  const listRecords = async () => records;

  const sortRecords = ({ matches, sort }) => {
    const { key, order } = sort[0];
    if (order === 'descending') {
      return matches.sort((a, b) => b[key] - a[key]);
    }
    return matches.sort((a, b) => a[key] - b[key]);
  };

  const findRecords = async ({ criteria, limit, sort }) => {
    const matches = await findMatchingRecords(criteria);
    const sorted = sortRecords({ matches, sort });
    if (limit) {
      return sorted.slice(0, limit);
    }
    return sorted;
  };

  const countRecords = async ({ criteria }) => {
    const result = await findMatchingRecords(criteria);
    return result.length;
  };

  return Object.freeze({
    records,
    insertRecord,
    findRecordById,
    updateRecord,
    listRecords,
    generateId,
    findRecords,
    countRecords,
  });
};

module.exports = makeMemoryRepo;
