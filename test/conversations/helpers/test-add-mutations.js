/* eslint-disable no-await-in-loop */
const fs = require('fs');

const testAddMutation = async ({ app, command, expected }) => {
  const result = await app.addMutation(command);
  result.conversationId.should.equal(command.conversationId, 'conversationId');
  result.text.should.equal(expected.text, `text, command = ${JSON.stringify(command)}`);
};

const testAddMutations = async (app, example) => {
  const data = JSON.parse(fs.readFileSync(`test/conversations/data/${example}.json`, 'utf-8'));
  const { tests } = data;
  for (let i = 0; i < tests.length; i += 1) {
    await testAddMutation({
      app,
      command: tests[i].mutation,
      expected: tests[i].expected,
    });
  }
};

module.exports = testAddMutations;
