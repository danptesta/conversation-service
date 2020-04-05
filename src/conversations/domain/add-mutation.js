const { InvalidPropertyError } = require('../../helpers/errors');
const {
  validateRequiredFields,
  validateSupportedFields,
  validateSupportedValues,
} = require('../../helpers/validators');

const requiredFields = ['author', 'data', 'origin'];
const supportedFields = ['author', 'data', 'origin'];
const supportedAuthors = ['alice', 'bob'];

const validateAuthor = ({ author }) => validateSupportedValues({
  field: 'author',
  values: [author],
  supportedValues: supportedAuthors,
});

const isValidOriginFieldKey = key => supportedAuthors.find(author => author === key);
const isValidOriginFieldValue = value => (typeof value === 'number' && value >= 0);
const isValidOriginField = ([key, value]) => isValidOriginFieldKey(key) && isValidOriginFieldValue(value);
const originHasValidFields = (origin) => {
  let result = true;
  const fields = Object.entries(origin);
  for (let i = 0; i < fields.length && result; i += 1) {
    result = isValidOriginField(fields[i]);
  }
  return result;
};
const originHasRequiredFields = (origin) => {
  let result = true;

  for (let i = 0; i < supportedAuthors.length && result; i += 1) {
    result = origin[supportedAuthors[i]];
  }

  return result;
};

const isValidOrigin = (origin) => {
  let result = true;
  result = result && (typeof origin === 'object');
  result = result && originHasValidFields(origin);
  result = result && originHasRequiredFields(origin);
  return result;
};

const validateOrigin = ({ origin }) => {
  if (!isValidOrigin(origin)) {
    throw new InvalidPropertyError("origin must be of the form '{ alice: x, bob: y }' where x and y are numbers >= 0");
  }
};

const validate = (input) => {
  validateRequiredFields({ input, requiredFields });
  validateSupportedFields({ input, supportedFields });
  validateAuthor(input);
  validateOrigin(input);
};

const addMutation = (input) => {
  validate(input);
};

module.exports = addMutation;
