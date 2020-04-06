const { InvalidPropertyError } = require('../../helpers/errors');

const buildText = mutations => ((mutations.length > 0) ? mutations[0].data.text : '');

const validateInsertNoLength = (data) => {
  if (data.length) {
    throw new InvalidPropertyError('length is not allowed on insert');
  }
};

const validateInsertIndexInRange = (conversation, data) => {
  const currentText = buildText(conversation.mutations);
  if (data.index > currentText.length) {
    throw new InvalidPropertyError('index is out of range');
  }
};

const validateInsert = (conversation, data) => {
  validateInsertNoLength(data);
  validateInsertIndexInRange(conversation, data);
};

const validateDelete = (data) => {
  if (data.text) {
    throw new InvalidPropertyError('text is not allowed on delete');
  }
};

const validateType = (conversation, { data }) => {
  if (data.type === 'insert') {
    validateInsert(conversation, data);
  } else {
    validateDelete(data);
  }
};

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

const validate = ({ conversation, mutation }) => {
  validateType(conversation, mutation);
  validateOriginMatchesCurrentState({ conversation, mutation });
};

const applyMutation = ({ conversation, mutation }) => ({
  conversationId: conversation.conversationId,
  mutations: [...conversation.mutations, mutation],
});

const addMutation = ({ conversation, mutation }) => {
  validate({ conversation, mutation });
  const applied = applyMutation({ conversation, mutation });
  return {
    conversation: applied,
    text: buildText(applied.mutations),
  };
};

module.exports = addMutation;
