const addMutationCommand = require('./commands/add-mutation');

const makeApp = ({ repository }) => Object.freeze({
  addMutation: async command => addMutationCommand({ command, repository }),
  listConversations: () => repository.listConversations(),
});

module.exports = makeApp;
