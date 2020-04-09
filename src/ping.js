const { makeHttpSuccess } = require('./helpers/http-response');

module.exports.handle = async () => makeHttpSuccess({
  statusCode: 200,
  result: { msg: 'pong' },
});
