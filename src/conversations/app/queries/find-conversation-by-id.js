const findConversationById = async ({ conversationId, repository }) => {
  const result = await repository.findConversationById(conversationId);
  return result ? Object.freeze(result) : null;
};

module.exports = findConversationById;
