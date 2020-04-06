const { validateJson } = require('../../../helpers/validators');
const findConversationById = require('../queries/find-conversation-by-id');
const domain = require('../../domain');

const addMutation = async ({
  command: mutation,
  repository,
}) => {
  validateJson({ schemaName: 'add-mutation', data: mutation });
  const conversation = await findConversationById({
    conversationId: mutation.conversationId,
    repository,
  });
  const result = domain.addMutation(conversation, mutation);
  repository.saveMutation(mutation);
  return result.text;
};

module.exports = addMutation;
