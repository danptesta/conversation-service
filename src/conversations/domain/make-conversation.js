const makeConversation = ({
  conversationId,
  text = '',
  lastMutation = null,
}) => ({
  conversationId,
  lastMutation,
  text,
});

module.exports = makeConversation;
