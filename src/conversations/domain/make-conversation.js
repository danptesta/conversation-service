const makeText = require('./make-text');

const makeConversation = mutations => ({
  conversationId: mutations[0].conversationId,
  lastMutation: mutations[mutations.length - 1],
  text: makeText(mutations),
});

module.exports = makeConversation;
