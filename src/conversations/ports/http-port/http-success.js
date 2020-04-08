const makeHttpSuccess = ({ statusCode, result }) => ({
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  },
  statusCode,
  body: JSON.stringify(result),
});

module.exports = makeHttpSuccess;
