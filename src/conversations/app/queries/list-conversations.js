const makeConversation = require('../../domain/make-conversation');

const groupByConversationId = (mutations) => {
  const result = {};

  mutations.forEach((mutation) => {
    const { conversationId } = mutation;
    if (!result[conversationId]) result[conversationId] = [];
    result[conversationId].push(mutation);
  });

  return result;
};

const makeConversations = (mutationsByConversationId) => {
  const result = [];
  Object.values(mutationsByConversationId).forEach((mutations) => {
    result.push(makeConversation(mutations));
  });
  return result;
};

const findConversationById = async ({ repository }) => {
  const mutations = await repository.listMutations();
  if (mutations.length === 0) return Object.freeze([]);
  return Object.freeze(makeConversations(groupByConversationId(mutations)));
};

module.exports = findConversationById;
