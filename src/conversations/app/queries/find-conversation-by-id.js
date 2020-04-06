const { makeConversation } = require('../../domain');

const findConversationById = async ({ conversationId, repository }) => {
  const mutations = await repository.findMutationsByConversationId(conversationId);
  return makeConversation(conversationId, mutations);
};

module.exports = findConversationById;
