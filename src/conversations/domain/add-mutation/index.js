/* eslint-disable arrow-body-style */
const validateType = require('./validate-type');
const makeConversation = require('../make-conversation');
const validateState = require('./validate-state');
const { isConflictingInsert } = require('./state');
const editText = require('./edit-text');

const validateMutation = (conversation, mutation) => {
  validateType(conversation, mutation);
  validateState(conversation, mutation);
};

const transformOrigin = (lastMutation) => {
  const result = { ...lastMutation.origin };
  result[lastMutation.author] += 1;
  return result;
};

const transformIndex = (mutation, lastMutation) => {
  return (lastMutation.data.index < mutation.data.index)
    ? mutation.data.index + lastMutation.data.text.length
    : mutation.data.index;
};

const transformData = (mutation, lastMutation) => {
  const result = { ...mutation.data };
  result.index = transformIndex(mutation, lastMutation);
  return result;
};

const transformMutation = (mutation, lastMutation) => {
  const result = { ...mutation };
  result.origin = transformOrigin(lastMutation);
  result.data = transformData(mutation, lastMutation);
  return result;
};

const resolveMutation = (conversation, mutation) => {
  return isConflictingInsert(conversation, mutation)
    ? transformMutation(mutation, conversation.lastMutation)
    : mutation;
};

const addMutation = (conversation, mutation) => {
  validateMutation(conversation, mutation);
  const resolved = resolveMutation(conversation, mutation);
  return makeConversation({
    conversationId: conversation.conversationId,
    text: editText(conversation.text, resolved),
    lastMutation: resolved,
  });
};

module.exports = addMutation;
