const makeConversation = ({
  conversationId,
  text = '',
  lastMutation = null,
}) => ({
  conversationId,
  text,
  lastMutation,
});

module.exports = makeConversation;
