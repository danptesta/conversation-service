const insertText = (text, data) => {
  return `${text}${data.text}`;
};

const deleteText = (text, { index, length }) => {
  const before = text.substring(0, index);
  const after = text.substring(index + length);
  return before + after;
};

const reduceMutation = (text, mutation) => {
  const { data } = mutation;
  if (data.type === 'insert') {
    return insertText(text, data);
  }
  return deleteText(text, data);
};

const makeText = mutations => mutations.reduce(reduceMutation, '');

const makeConversation = (conversationId, mutations) => ({
  conversationId,
  mutations,
  text: makeText(mutations),
});

module.exports = makeConversation;
