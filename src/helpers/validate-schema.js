const Ajv = require('ajv');
const fs = require('fs');
const { InvalidInputError } = require('./errors');

const validateSchema = ({ schemaName, data }) => {
  const schema = JSON.parse(fs.readFileSync(`schemas/${schemaName}.json`, 'utf-8'));
  const ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}
  const valid = ajv.validate(schema, data);
  if (!valid) {
    throw new InvalidInputError(ajv.errors);
  }
};

module.exports = validateSchema;
