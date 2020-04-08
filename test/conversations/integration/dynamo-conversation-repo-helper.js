const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB();

module.exports.createTestTable = async function createTestTable(tableName) {
  console.log(`Creating conversations table with name '${tableName}'...`);
  const start = new Date().getTime();

  const params = {
    AttributeDefinitions: [
      {
        AttributeName: 'conversationId',
        AttributeType: 'S',
      },
    ],
    KeySchema: [{
      AttributeName: 'conversationId',
      KeyType: 'HASH',
    }],
    TableName: tableName,
    BillingMode: 'PAY_PER_REQUEST',
  };

  await dynamoDb.createTable(params).promise();
  await dynamoDb.waitFor('tableExists', {
    TableName: tableName,
  }).promise();

  console.log(`...created conversations table with name '${tableName}, `
    + `elapsed time (ms) =  ${(new Date().getTime()) - start}'.`);
};

module.exports.deleteTestTable = async function deleteTestTable(tableName) {
  console.log(`Deleting conversations table with name '${tableName}'...`);
  const start = new Date().getTime();

  await dynamoDb.deleteTable({
    TableName: tableName,
  }).promise();

  // we don't really need to wait for this and it takes too long.
  // await dynamoDb.waitFor('tableNotExists', {
  //   TableName: tableName,
  // }).promise();

  console.log(`...deleted conversations table with name '${tableName}', `
    + `elapsed time (ms) =  ${(new Date().getTime()) - start}'.`);
};
