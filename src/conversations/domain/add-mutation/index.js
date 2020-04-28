/* eslint-disable arrow-body-style */

const validateType = require('./validate-type');
const validateOrigin = require('./validate-origin');
const findConflicts = require('./find-conflicts');
const transformMutation = require('./transform-mutation');
const makeConversation = require('../make-conversation');

const validateMutation = ({ mutations, mutation }) => {
  validateType(mutation);
  validateOrigin({ mutations, mutation });
};

const resolveConflicts = ({ mutations, mutation }) => {
  const conflicts = findConflicts({ mutations, mutation });
  return conflicts.reduce(transformMutation, mutation);
};

const addMutation = ({ mutations, mutation }) => {
  validateMutation({ mutations, mutation });
  const resolved = resolveConflicts({ mutations, mutation });
  return makeConversation([...mutations, resolved]);
};

module.exports = addMutation;
