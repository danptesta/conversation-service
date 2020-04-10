const createExpectedResponse = (expectedStatusCode, expectedBody) => JSON.stringify({
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'https://app.ava.me',
    'Access-Control-Allow-Credentials': true,
  },
  statusCode: expectedStatusCode,
  body: JSON.stringify(expectedBody),
});

const assertHttpResponse = ({
  response, expectedStatusCode, expectedBody, customMessage,
}) => {
  const expectedResponse = createExpectedResponse(expectedStatusCode, expectedBody);
  JSON.stringify(response).should.equal(expectedResponse, customMessage);
};

module.exports = assertHttpResponse;
