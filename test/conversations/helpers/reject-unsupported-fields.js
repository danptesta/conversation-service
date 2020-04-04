const { InvalidPropertyError } = require('../../../src/helpers/errors');

const rejectUnsupportedFields = async ({ appFunction, createCommand, unsupportedFields }) => {
  const rejectUnsupportedField = async (unsupportedField) => {
    const command = createCommand({});
    command[unsupportedField] = 'this field should not be allowed';
    const errorMessage = new RegExp(`Unsupported fields:.*\\b${unsupportedField}\\b.*`);
    const customMessage = `unsupported field = ${unsupportedField}`;
    await appFunction(command).should.be.rejectedWith(InvalidPropertyError, errorMessage, customMessage);
  };

  const results = [];
  unsupportedFields.forEach(unsupportedField => results.push(rejectUnsupportedField(unsupportedField)));
  await Promise.all(results);
};

module.exports = rejectUnsupportedFields;
