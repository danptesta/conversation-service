/* eslint-disable arrow-body-style */
const makeMemoryConversationRepoAdapter = () => {
  const mutations = [];

  const findMutationsByConversationId = async (conversationId) => {
    return mutations.filter(mutation => mutation.conversationId === conversationId);
  };

  const addMutation = async (mutation) => {
    mutations.push(mutation);
  };

  const listMutations = async () => {
    return mutations;
  };

  return Object.freeze({
    findMutationsByConversationId,
    addMutation,
    listMutations,
  });
};

module.exports = makeMemoryConversationRepoAdapter;
