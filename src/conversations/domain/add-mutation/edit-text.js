const insertText = (text, data) => {
  const before = text.substring(0, data.index);
  const after = text.substring(data.index);
  return before + data.text + after;
};

const deleteText = (text, { index, length }) => {
  const before = text.substring(0, index);
  const after = text.substring(index + length);
  return before + after;
};

const editText = (text, mutation) => {
  const { data } = mutation;
  if (data.type === 'insert') {
    return insertText(text, data);
  }
  return deleteText(text, data);
};

module.exports = editText;
