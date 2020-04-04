const {
  InvalidPropertyError,
} = require('../errors');

const isNumber = value => !Number.isNaN(+value) && Number.isFinite(value);
const isNumberAtLeastOne = value => isNumber(value) && value >= 1;


const validateNumberAtLeastOne = ({ field, value }) => {
  if (!isNumberAtLeastOne(value)) {
    throw new InvalidPropertyError(`${field} must be a number with a minimum value of 1`);
  }
};

module.exports = validateNumberAtLeastOne;
