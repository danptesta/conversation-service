const makeConversation = require('../../domain/make-conversation');
const {
  ConversationNotFoundError,
} = require('../../../helpers/errors');

const findConversationById = async ({ conversationId, repository }) => {
  const mutations = await repository.findMutationsByConversationId(conversationId);
  if (mutations.length === 0) throw new ConversationNotFoundError();
  return Object.freeze(makeConversation(mutations));
};

module.exports = findConversationById;
