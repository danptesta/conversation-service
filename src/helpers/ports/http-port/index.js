const makeHttpSuccess = require('./http-success');
const makeHttpError = require('./http-error');
const makeHandleHttpPort = require('./handle-http-port');
const makeRoutePatchRequest = require('./route-patch-request');
const makeRoutePostRequest = require('./route-post-request');
const makeRouteGetRequest = require('./route-get-request');

module.exports = {
  makeHttpSuccess,
  makeHttpError,
  makeHandleHttpPort,
  makeRoutePatchRequest,
  makeRoutePostRequest,
  makeRouteGetRequest,
};
