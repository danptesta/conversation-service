const headers = {
  'Content-Type': 'application/json',
  // todo: 'Access-Control-Allow-Origin': 'https://app.ava.me',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};

const makeHttpSuccess = ({ statusCode, result }) => ({
  headers,
  statusCode,
  body: JSON.stringify(result),
});

module.exports = makeHttpSuccess;
const makeHttpError = ({ statusCode, msg }) => ({
  headers,
  statusCode,
  body: JSON.stringify({
    msg,
    ok: false,
  }),
});

module.exports = { makeHttpSuccess, makeHttpError };
