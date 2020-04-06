const { InvalidPropertyError } = require('../../helpers/errors');

const isSameOrigin = (origin1, origin2) => (origin1.alice === origin2.alice) && (origin1.bob === origin2.bob);

const originMatchesCurrentState = ({ conversation, mutation }) => {
  if (conversation.mutations.length === 0) {
    return isSameOrigin({ alice: 0, bob: 0 }, mutation.origin);
  }
  const lastMutation = conversation.mutations[conversation.mutations.length - 1];
  return isSameOrigin(lastMutation.origin, mutation.origin);
};

const validateOriginMatchesCurrentState = ({ conversation, mutation }) => {
  if (!originMatchesCurrentState({ conversation, mutation })) {
    throw new InvalidPropertyError('origin does not match current state');
  }
};

const validateOrigin = ({ conversation, mutation }) => {
  validateOriginMatchesCurrentState({ conversation, mutation });
};

module.exports = validateOrigin;
