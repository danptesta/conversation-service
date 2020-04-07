const AWS = require('aws-sdk');
const https = require('https');
const makeListRecords = require('./list-records');
const makeFindRecords = require('./find-records');
const makeCountRecords = require('./count-records');
const makePutRecord = require('./put-record');
const makeInsertRecord = require('./insert-record');
const makeFindRecordById = require('./find-record-by-id');
const makeUpdateRecord = require('./update-record');
const generateId = require('./generate-id');
const makeDynamoLogger = require('./dynamo-logger');

const dynamo = new AWS.DynamoDB({
  httpOptions: {
    agent: new https.Agent({
      rejectUnauthorized: true,
      keepAlive: true,
    }),
  },
});
const docClient = new AWS.DynamoDB.DocumentClient({ service: dynamo });

const makeDynamoRepoAdapter = ({
  service,
  port,
  tableName,
  idField,
  compositeIndexKeys = [],
  logLevel,
}) => {
  const logger = makeDynamoLogger({ service, port, logLevel });

  const putRecord = makePutRecord({
    tableName, docClient, logger, compositeIndexKeys,
  });

  const { findRecordById, findRecordByIdUnfiltered } = makeFindRecordById({
    tableName, docClient, logger, idField, compositeIndexKeys,
  });

  return Object.freeze({
    docClient,
    logger,
    insertRecord: makeInsertRecord({ putRecord }),
    generateId,
    findRecordById,
    updateRecord: makeUpdateRecord({ findRecordByIdUnfiltered, putRecord, idField }),
    listRecords: makeListRecords({
      tableName, docClient, logger, compositeIndexKeys,
    }),
    findRecords: makeFindRecords({
      tableName, docClient, logger, compositeIndexKeys,
    }),
    countRecords: makeCountRecords({ tableName, docClient, logger }),
  });
};

module.exports = makeDynamoRepoAdapter;
