const makeText = mutations => mutations.reduce((text, mutation) => `${text}${mutation.data.text}`, '');

const makeConversation = (conversationId, mutations) => ({
  conversationId,
  mutations,
  text: makeText(mutations),
});

module.exports = makeConversation;
