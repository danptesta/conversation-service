const validateType = require('./validate-type');
const validateOrigin = require('./validate-origin');

const buildText = mutations => ((mutations.length > 0) ? mutations[0].data.text : '');

const validate = ({ currentText, conversation, mutation }) => {
  validateType(currentText, mutation);
  validateOrigin({ conversation, mutation });
};

const applyMutation = ({ conversation, mutation }) => ({
  conversationId: conversation.conversationId,
  mutations: [...conversation.mutations, mutation],
});

const addMutation = ({ conversation, mutation }) => {
  const currentText = buildText(conversation.mutations);
  validate({ currentText, conversation, mutation });
  const applied = applyMutation({ conversation, mutation });
  return {
    conversation: applied,
    text: buildText(applied.mutations),
  };
};

module.exports = addMutation;
