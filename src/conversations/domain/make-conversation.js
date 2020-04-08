const makeConversation = ({
  conversationId,
  text = '',
  lastMutation = null,
  state = { bob: 0, alice: 0 },
}) => ({
  conversationId,
  text,
  lastMutation,
  state,
});

module.exports = makeConversation;
