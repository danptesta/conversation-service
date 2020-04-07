const { InvalidPropertyError } = require('../../../helpers/errors');
const isConflictingInsert = require('./is-conflicting-insert');

const isSameOrigin = (origin1, origin2) => (origin1.alice === origin2.alice) && (origin1.bob === origin2.bob);

const isCurrentState = (conversation, mutation) => {
  if (isConflictingInsert(conversation, mutation)) return true;
  return isSameOrigin(conversation.state, mutation.origin);
};

const validateCurrentState = (conversation, mutation) => {
  if (!isCurrentState(conversation, mutation)) {
    throw new InvalidPropertyError('origin does not match current state');
  }
};

module.exports = validateCurrentState;
