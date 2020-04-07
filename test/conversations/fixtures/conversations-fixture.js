const uuidv1 = require('uuid/v1');

const createAddMutationCommand = ({
  author = 'alice',
  conversationId = `${uuidv1()}`,
  data = {
    index: 0,
    length: undefined,
    text: 'hello',
    type: 'insert',
  },
  origin = {
    alice: 0,
    bob: 0,
  },
  ...otherInfo
}) => ({
  author,
  conversationId,
  data,
  origin,
  ...otherInfo,
});

const createAddMutationInsertCommand = ({
  author, conversationId, index, text, origin,
}) => ({
  author,
  conversationId,
  data: {
    index,
    text,
    type: 'insert',
  },
  origin,
});

const createAddMutationDeleteCommand = ({
  author, conversationId, index, length, origin,
}) => ({
  author,
  conversationId,
  data: {
    index,
    length,
    type: 'delete',
  },
  origin,
});

module.exports = {
  createAddMutationCommand,
  createAddMutationInsertCommand,
  createAddMutationDeleteCommand,
};
