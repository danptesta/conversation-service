const validateSchema = require('../../../helpers/validate-schema');
const domain = require('../../domain');

const addMutation = async ({
  command: mutation,
  repository,
}) => {
  validateSchema({ schemaName: 'add-mutation', data: mutation });
  const mutations = await repository.findMutationsByConversationId(mutation.conversationId);
  const conversation = domain.addMutation({ mutations, mutation });
  await repository.addMutation(conversation.lastMutation);
  return conversation;
};

module.exports = addMutation;
