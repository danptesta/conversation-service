const AWS = require('aws-sdk');
const https = require('https');
const makeListRecords = require('./list-records');
const makePutRecord = require('./put-record');
const makeInsertRecord = require('./insert-record');
const makeFindRecordById = require('./find-record-by-id');
const makeUpdateRecord = require('./update-record');
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
  logLevel,
}) => {
  const logger = makeDynamoLogger({ service, port, logLevel });

  const putRecord = makePutRecord({
    tableName, docClient, logger,
  });

  return Object.freeze({
    docClient,
    logger,
    insertRecord: makeInsertRecord({ putRecord }),
    findRecordById: makeFindRecordById({
      tableName, docClient, logger, idField,
    }),
    updateRecord: makeUpdateRecord({ putRecord }),
    listRecords: makeListRecords({ tableName, docClient, logger }),
  });
};

module.exports = makeDynamoRepoAdapter;
