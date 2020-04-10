const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': 'https://app.ava.me',
  'Access-Control-Allow-Credentials': true,
};

const makeHttpSuccess = ({ statusCode, result }) => ({
  headers,
  statusCode,
  body: JSON.stringify({ ok: true, ...result }),
});

const makeHttpError = ({ statusCode, msg }) => ({
  headers,
  statusCode,
  body: JSON.stringify({ ok: false, msg }),
});

module.exports = { makeHttpSuccess, makeHttpError };
