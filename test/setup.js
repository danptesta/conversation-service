global.chai = require('chai');

const chaiAsPromised = require('chai-as-promised');

global.should = chai.should();
chai.use(chaiAsPromised);

const assertArrays = require('chai-arrays');

chai.use(assertArrays);
