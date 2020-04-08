const { ConversationNotFoundError } = require('../../../helpers/errors');

const removeConversation = async ({ conversationId, repository }) => {
  try {
    await repository.deleteConversation(conversationId);
  } catch (error) {
    throw new ConversationNotFoundError();
  }
};

module.exports = removeConversation;
