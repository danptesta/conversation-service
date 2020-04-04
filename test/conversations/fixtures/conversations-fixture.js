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

const createAddMutationCommandWithMissingKey = (field) => {
  const commandWithMissingField = createAddMutationCommand({});
  delete commandWithMissingField[field];
  return commandWithMissingField;
};

module.exports = {
  createAddMutationCommand,
  createAddMutationCommandWithMissingKey,
};
