const _ = require('lodash');
const { EntityNotFoundError } = require('../errors');

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

  const listRecords = async () => records;

  const removeRecord = async (id) => {
    let index = -1;
    for (let i = 0; i < records.length && index === -1; i += 1) {
      if (records[i][idField] === id) index = i;
    }
    if (index === -1) throw new EntityNotFoundError('entity');
    records.splice(index, 1);
  };

  return Object.freeze({
    records,
    insertRecord,
    findRecordById,
    updateRecord,
    listRecords,
    removeRecord,
  });
};

module.exports = makeMemoryRepo;
