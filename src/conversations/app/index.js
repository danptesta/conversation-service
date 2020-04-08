const addMutationCommand = require('./commands/add-mutation');
const findConversationById = require('./queries/find-conversation-by-id');

const makeApp = ({ repository }) => Object.freeze({
  addMutation: async command => addMutationCommand({ command, repository }),
  listConversations: async () => repository.listConversations(),
  findConversationById: async conversationId => findConversationById({ conversationId, repository }),
  removeConversation: async conversationId => repository.deleteConversation(conversationId),
});

module.exports = makeApp;
