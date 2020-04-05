const { InvalidPropertyError } = require('../../../src/helpers/errors');

const rejectUnsupportedValues = async ({
  appFunction, createCommand, field, errorMessage, unsupportedValues,
}) => {
  const rejectUnsupportedValue = async (unsupportedFieldValue) => {
    const command = createCommand({});
    command[field] = unsupportedFieldValue;
    const customMessage = `unsupported value for field '${field}'`;
    await appFunction(command).should.be.rejectedWith(InvalidPropertyError, errorMessage, customMessage);
  };

  const results = [];
  unsupportedValues.forEach(unsupportedField => results.push(rejectUnsupportedValue(unsupportedField)));
  await Promise.all(results);
};

module.exports = rejectUnsupportedValues;
