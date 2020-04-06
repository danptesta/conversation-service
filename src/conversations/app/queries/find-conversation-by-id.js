const findRecordById = async ({ conversationId, repository }) => {
  const result = await repository.findRecordById(conversationId);
  return result || { conversationId, mutations: [] };
};

module.exports = findRecordById;
