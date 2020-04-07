const {
  createAddMutationInsertCommand,
  createAddMutationDeleteCommand,
} = require('../fixtures/conversations-fixture');

const testAddMutation = async ({ app, command, expected }) => {
  const result = await app.addMutation(command);
  result.should.equal(expected, `command = ${JSON.stringify(command)}`);
};

const testAddMutationInsert = async ({
  app, author, conversationId, index, text, origin, expected,
}) => {
  const command = createAddMutationInsertCommand({
    author, conversationId, index, text, origin,
  });
  await testAddMutation({ app, command, expected });
};

const testAddMutationDelete = async ({
  app, author, conversationId, index, length, origin, expected,
}) => {
  const command = createAddMutationDeleteCommand({
    author, conversationId, index, length, origin,
  });
  await testAddMutation({ app, command, expected });
};

module.exports = {
  testAddMutationInsert,
  testAddMutationDelete,
};
