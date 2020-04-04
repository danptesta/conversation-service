const stampTime = ({ entity, field, timeStamp = Date.now() }) => {
  const result = { ...entity };
  result[`${field}Raw`] = timeStamp;
  result[field] = (new Date(timeStamp)).toString();
  return result;
};

module.exports = stampTime;
