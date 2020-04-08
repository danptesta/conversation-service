const {
  EntityNotFoundError,
  ConversationNotFoundError,
} = require('../../../helpers/errors');

const removeConversation = async ({ conversationId, repository }) => {
  try {
    await repository.removeConversation(conversationId);
  } catch (error) {
    if (error instanceof EntityNotFoundError) throw new ConversationNotFoundError();
    throw error;
  }
};

module.exports = removeConversation;
