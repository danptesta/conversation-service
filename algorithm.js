/* eslint-disable arrow-body-style */
const compareState = ({ index, existing, mutation }) => {
  let result = -1;

  if (mutation.author === 'alice') {
    if (existing.author === 'alice') {
      if (existing.origin.alice !== (mutation.origin.alice - 1)) {
        throw new Error('state mismatch');
      }
      if (existing.origin.bob === (mutation.origin.bob - 1)) {
        result = index;
      } else if (existing.origin.bob === mutation.origin.bob) {
        result = index + 1;
      }
    }
  } else if (mutation.author === 'bob') {
    if (existing.author === 'bob') {
      if (existing.origin.bob !== (mutation.origin.bob - 1)) {
        throw new Error('state mismatch');
      }
      if (existing.origin.alice === (mutation.origin.alice - 1)) {
        result = index;
      } else if (existing.origin.alice === mutation.origin.alice) {
        result = index + 1;
      }
    }
  }

  return result;
};

const findMatchingState = ({ mutations, mutation }) => {
  if (mutations.length === 0) return 0;

  for (let i = 0; i < mutations.length; i += 1) {
    const result = compareState({
      index: i,
      existing: mutations[i],
      mutation,
    });
    if (result !== -1) return result;
  }
  throw new Error('state mismatch');
};

const findConflicts = ({ mutations, mutation }) => {
  const index = findMatchingState({ mutations, mutation });
  return mutations.slice(0, index);
};

const transformIndex = ({ mutation, conflict }) => {
  // this is oversimplified and will not work if mutation is a delete and overlaps with conflict.
  return (conflict.data.index < mutation.data.index)
    ? mutation.data.index + conflict.data.text.length
    : mutation.data.index;
};

const transformData = ({ mutation, conflict }) => {
  const result = { ...mutation.data };
  result.index = transformIndex({ mutation, conflict });
  return result;
};

const getState = ({ author, origin }) => {
  const result = { ...origin };
  result[author] += 1;
  return result;
};

const transformMutation = (mutation, conflict) => {
  const result = { ...mutation };
  result.origin = getState(conflict);
  result.data = transformData({ mutation, conflict });
  return result;
};

const resolveMutation = ({ mutations, mutation }) => {
  const conflicts = findConflicts({ mutations, mutation });
  return conflicts.reduce(transformMutation, mutation);
};

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

const buildText = ({ mutations, resolved }) => {
  return [resolved, ...mutations].reduce(editText, '');
};

const addMutation = ({ mutations, mutation }) => {
  const resolved = resolveMutation({ mutations, mutation });

  return {
    conversationId: resolved.conversationId,
    lastMutation: resolved,
    text: buildText({ mutations, resolved }),
  };
};

addMutation({
  // ordered from newest to oldest
  mutations: [
    {
      author: 'alice',
      origin: {
        alice: 0,
        bob: 0,
      },
    },
  ],
  mutation: {
    author: 'alice',
    origin: {
      alice: 0,
      bob: 0,
    },
  },
});
