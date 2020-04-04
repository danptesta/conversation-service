const stampTime = require('./stamp-time');

const changeState = ({
  entity, field, newState, timeStampField, timeStampValue,
}) => {
  let result = { ...entity };
  result[field] = newState;
  result = stampTime({
    entity: result,
    field: timeStampField || newState,
    timeStamp: timeStampValue,
  });
  return stampTime({ entity: result, field: 'lastModified', timeStamp: Date.now() });
};

module.exports = changeState;
