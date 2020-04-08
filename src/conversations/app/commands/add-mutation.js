const validateJson = require('../../../helpers/validate-json');
const findConversationById = require('../queries/find-conversation-by-id');
const domain = require('../../domain');
const {
  ConversationNotFoundError,
} = require('../../../helpers/errors');

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
  try {
    validateJson({ schemaName: 'add-mutation', data: mutation });
    const conversation = await findConversationById({
      conversationId: mutation.conversationId,
      repository,
    });
    return await addMutationToExistingConversation({ conversation, mutation, repository });
  } catch (error) {
    if (error instanceof ConversationNotFoundError) {
      return addMutationToNewConversation({ mutation, repository });
    }
    throw error;
  }
};

module.exports = addMutation;
