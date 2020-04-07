const { validateJson } = require('../../../helpers/validators');
const findConversationById = require('../queries/find-conversation-by-id');
const domain = require('../../domain');

const addMutationToExistingConversation = async ({ conversation, mutation, repository }) => {
  const result = domain.addMutation(conversation, mutation);
  await repository.updateConversation(result);
  return result;
};

const addMutationToNewConversation = async ({ mutation, repository }) => {
  const conversation = domain.makeConversation({ conversationId: mutation.conversationId });
  const result = domain.addMutation(conversation, mutation);
  await repository.insertConversation(result);
  return result;
};

const addMutation = async ({
  command: mutation,
  repository,
}) => {
  validateJson({ schemaName: 'add-mutation', data: mutation });

  const conversation = await findConversationById({
    conversationId: mutation.conversationId,
    repository,
  });

  if (conversation) {
    return addMutationToExistingConversation({ conversation, mutation, repository });
  }
  return addMutationToNewConversation({ mutation, repository });
};

module.exports = addMutation;
