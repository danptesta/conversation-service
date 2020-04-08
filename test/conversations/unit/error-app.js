module.exports = function makeMigrationsApp() {
  const throwUnexpectedError = () => {
    throw new Error('something unexpected happened.');
  };

  return Object.freeze({
    addMutation: throwUnexpectedError,
    findConversationById: throwUnexpectedError,
    listConversations: throwUnexpectedError,
    removeConversation: throwUnexpectedError,
  });
};
