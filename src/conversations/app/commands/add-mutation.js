const { validateJson } = require('../../../helpers/validators');
const domain = require('../../domain');

const addMutation = async ({
  command,
  // repository,
}) => {
  validateJson({ schemaName: 'add-mutation', data: command });
  const { conversationId, ...input } = command;
  domain.addMutation(input);
};

module.exports = addMutation;
