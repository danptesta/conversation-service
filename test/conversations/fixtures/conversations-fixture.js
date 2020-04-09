const uuidv1 = require('uuid/v1');

const createAddMutationCommand = ({
  author = 'alice',
  conversationId = `${uuidv1()}`,
  data = {
    index: 0,
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

module.exports = {
  createAddMutationCommand,
};
