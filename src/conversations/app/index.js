const addMutationCommand = require('./commands/add-mutation');
const findConversationById = require('./queries/find-conversation-by-id');
const listConversations = require('./queries/list-conversations');

const makeApp = ({ repository }) => Object.freeze({
  addMutation: async command => addMutationCommand({ command, repository }),
  listConversations: async () => listConversations({ repository }),
  findConversationById: async conversationId => findConversationById({ conversationId, repository }),
  removeConversation: async conversationId => repository.deleteMutationsByConversationId(conversationId),
});

module.exports = makeApp;
