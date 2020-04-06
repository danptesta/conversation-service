const makeConversationRepoMemoryAdapter = () => {
  const mutations = [];

  const saveMutation = (mutation) => {
    mutations.push(mutation);
  };

  const findMutationsByConversationId = conversationId => mutations.filter(mutation => mutation.conversationId === conversationId);

  return Object.freeze({
    saveMutation,
    findMutationsByConversationId,
  });
};

module.exports = makeConversationRepoMemoryAdapter;
