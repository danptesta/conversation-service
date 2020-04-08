const {
  ConversationNotFoundError,
} = require('../../../helpers/errors');

const findConversationById = async ({ conversationId, repository }) => {
  const result = await repository.findConversationById(conversationId);
  if (result) return Object.freeze(result);
  throw new ConversationNotFoundError();
};

module.exports = findConversationById;
