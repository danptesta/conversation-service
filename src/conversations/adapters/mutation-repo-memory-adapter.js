/* eslint-disable arrow-body-style */
const makeMemoryMutationRepoAdapter = () => {
  let mutations = [];

  const findMutationsByConversationId = async (conversationId) => {
    return mutations.filter(mutation => mutation.conversationId === conversationId);
  };

  const addMutation = async (mutation) => {
    mutations.push(mutation);
  };

  const listMutations = async () => {
    return mutations;
  };

  const deleteMutationsByConversationId = (conversationId) => {
    mutations = mutations.filter(mutation => mutation.conversationId !== conversationId);
  };

  return Object.freeze({
    findMutationsByConversationId,
    addMutation,
    listMutations,
    deleteMutationsByConversationId,
  });
};

module.exports = makeMemoryMutationRepoAdapter;
