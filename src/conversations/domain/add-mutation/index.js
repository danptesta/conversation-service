/* eslint-disable arrow-body-style */

const validateType = require('./validate-type');
const findConflicts = require('./find-conflicts');
const transformMutation = require('./transform-mutation');
const makeConversation = require('../make-conversation');

const resolveMutation = ({ mutations, mutation }) => {
  const conflicts = findConflicts({ mutations, mutation });
  return conflicts.reduce(transformMutation, mutation);
};

const addMutation = ({ mutations, mutation }) => {
  validateType(mutation);
  const resolved = resolveMutation({ mutations, mutation });
  return makeConversation([...mutations, resolved]);
};

module.exports = addMutation;
