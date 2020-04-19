const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB();

module.exports.createTestTable = async function createTestTable(tableName) {
  console.log(`Creating mutations table with name '${tableName}'...`);
  const start = new Date().getTime();

  const params = {
    AttributeDefinitions: [
      {
        AttributeName: 'conversationId',
        AttributeType: 'S',
      },
      {
        AttributeName: 'timestamp',
        AttributeType: 'N',
      },
    ],
    KeySchema: [
      {
        AttributeName: 'conversationId',
        KeyType: 'HASH',
      },
      {
        AttributeName: 'timestamp',
        KeyType: 'RANGE',
      },
    ],
    TableName: tableName,
    BillingMode: 'PAY_PER_REQUEST',
  };

  await dynamoDb.createTable(params).promise();
  await dynamoDb.waitFor('tableExists', {
    TableName: tableName,
  }).promise();

  console.log(`...created mutations table with name '${tableName}, `
    + `elapsed time (ms) =  ${(new Date().getTime()) - start}'.`);
};

module.exports.deleteTestTable = async function deleteTestTable(tableName) {
  console.log(`Deleting mutations table with name '${tableName}'...`);
  const start = new Date().getTime();

  await dynamoDb.deleteTable({
    TableName: tableName,
  }).promise();

  // we don't really need to wait for this and it takes too long.
  // await dynamoDb.waitFor('tableNotExists', {
  //   TableName: tableName,
  // }).promise();

  console.log(`...deleted mutations table with name '${tableName}', `
    + `elapsed time (ms) =  ${(new Date().getTime()) - start}'.`);
};
