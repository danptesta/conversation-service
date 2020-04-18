/* eslint-disable arrow-body-style */
const validateType = require('./validate-type');
const makeConversation = require('../make-conversation');
const validateState = require('./validate-state');
const { getState, isConflictingState } = require('./state');
const editText = require('./edit-text');

const validateMutation = (lastMutation, mutation) => {
  validateType(lastMutation, mutation);
  validateState(lastMutation, mutation);
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

const transformMutation = (lastMutation, mutation) => {
  const result = { ...mutation };
  result.origin = getState(lastMutation);
  result.data = transformData(mutation, lastMutation);
  return result;
};

const resolveMutation = (lastMutation, mutation) => {
  return isConflictingState(lastMutation, mutation)
    ? transformMutation(lastMutation, mutation)
    : mutation;
};

const addMutation = (conversation, mutation) => {
  const { lastMutation } = conversation;
  validateMutation(lastMutation, mutation);
  const resolved = resolveMutation(lastMutation, mutation);
  return makeConversation({
    conversationId: conversation.conversationId,
    text: editText(conversation.text, resolved),
    lastMutation: resolved,
  });
};

module.exports = addMutation;
