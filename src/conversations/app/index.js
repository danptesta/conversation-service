const addMutationCommand = require('./commands/add-mutation');

const makeApp = () => Object.freeze({
  addMutation: async command => addMutationCommand({ command }),
});

module.exports = makeApp;
