const domain = require('../../domain');
const {
  RequiredParameterError,
  InvalidPropertyError,
} = require('../../../helpers/errors');

const addMutation = async ({
  command,
  // repository,
}) => {
  if (!command || !command.conversationId) {
    throw new RequiredParameterError('conversationId');
  }
  if (typeof command.conversationId !== 'string') {
    throw new InvalidPropertyError('conversationId must be a string');
  }
  const { conversationId, ...input } = command;
  domain.addMutation(input);
};

module.exports = addMutation;
