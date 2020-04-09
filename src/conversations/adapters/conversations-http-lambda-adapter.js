const repository = require('./conversation-repo-dynamo-adapter')();
const app = require('../app')({ repository });
const handleHttpPort = require('../ports/conversations-http-port')({ app });
const makeLambdaHttpAdapter = require('../../helpers/adapters/lambda-http-adapter');

module.exports.handle = makeLambdaHttpAdapter({
  service: 'conversation',
  handleHttpPort,
});
