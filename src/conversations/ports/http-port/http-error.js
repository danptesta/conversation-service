const makeHttpError = ({ statusCode, errorMessage }) => ({
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  },
  statusCode,
  body: JSON.stringify({
    error: errorMessage,
  }),
});

module.exports = makeHttpError;
