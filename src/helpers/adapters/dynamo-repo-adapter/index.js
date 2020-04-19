const AWS = require('aws-sdk');
const https = require('https');
const makePutRecord = require('./put-record');
const makeInsertRecord = require('./insert-record');
const makeFindRecordById = require('./find-record-by-id');
const makeFindRecordsById = require('./find-records-by-id');
const makeUpdateRecord = require('./update-record');
const makeListRecords = require('./list-records');
const makeDeleteRecord = require('./delete-record');
const makeDeleteRecords = require('./delete-records');
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
  partitionKey,
  sortKey,
  logLevel,
}) => {
  const logger = makeDynamoLogger({ service, port, logLevel });

  const putRecord = makePutRecord({
    tableName, docClient, logger,
  });

  const findRecordsById = makeFindRecordsById({
    tableName, docClient, logger, partitionKey,
  });

  return Object.freeze({
    docClient,
    logger,
    insertRecord: makeInsertRecord({ putRecord }),
    findRecordById: makeFindRecordById({
      tableName, docClient, logger, partitionKey,
    }),
    findRecordsById,
    updateRecord: makeUpdateRecord({ putRecord }),
    listRecords: makeListRecords({ tableName, docClient, logger }),
    deleteRecord: makeDeleteRecord({
      tableName, docClient, logger, partitionKey,
    }),
    deleteRecords: makeDeleteRecords({
      tableName, docClient, logger, partitionKey, sortKey, findRecordsById,
    }),
  });
};

module.exports = makeDynamoRepoAdapter;
