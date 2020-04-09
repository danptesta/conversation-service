const fs = require('fs');
const { makeHttpSuccess } = require('./helpers/http-response');

module.exports.handle = async () => {
  const info = JSON.parse(fs.readFileSync('src/info.json', 'utf-8'));
  return makeHttpSuccess({
    statusCode: 200,
    result: info,
  });
};
