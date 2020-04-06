const validateType = require('./validate-type');
const validateOrigin = require('./validate-origin');
const makeConversation = require('./make-conversation');

const validate = (conversation, mutation) => {
  validateType(conversation, mutation);
  validateOrigin(conversation, mutation);
};

const addMutation = (conversation, mutation) => {
  validate(conversation, mutation);
  return makeConversation(conversation.conversationId, [...conversation.mutations, mutation]);
};

module.exports = addMutation;
