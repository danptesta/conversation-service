const { RequiredParameterError } = require('../../../src/helpers/errors');

const rejectMissingFields = async ({ appFunction, createCommand, requiredFields }) => {
  const rejectMissingKey = async (field, errorMessage) => {
    const command = createCommand({});
    delete command[field];
    await appFunction(command).should.be.rejectedWith(RequiredParameterError, errorMessage, 'missing key');
  };

  const rejectMissingValue = async (field, missingValue, errorMessage) => {
    const command = createCommand({});
    command[field] = missingValue;
    await appFunction(command).should.be.rejectedWith(RequiredParameterError, errorMessage, `missingValue = ${missingValue}`);
  };

  const rejectMissingValues = async (requiredField, errorMessage) => {
    const missingValues = [undefined, null, ''];
    const results = [];
    missingValues.forEach(missingValue => results.push(rejectMissingValue(requiredField, missingValue, errorMessage)));
    await Promise.all(results);
  };

  const rejectMissingField = async (requiredField) => {
    const errorMessage = new RegExp(`Missing required fields:.*\\b${requiredField}\\b.*`);
    await rejectMissingKey(requiredField, errorMessage);
    await rejectMissingValues(requiredField, errorMessage);
  };

  const results = [];
  requiredFields.forEach(requiredField => results.push(rejectMissingField(requiredField)));
  await Promise.all(results);
};

module.exports = rejectMissingFields;
