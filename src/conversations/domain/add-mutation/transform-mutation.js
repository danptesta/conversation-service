/* eslint-disable arrow-body-style */

const transformDataInsertInsert = ({ mutation, conflict }) => {
  const result = { ...mutation.data };
  result.index = (conflict.data.index < mutation.data.index)
    ? mutation.data.index + conflict.data.text.length
    : mutation.data.index;
  return result;
};

// const transformDataInsertDelete = ({ mutation, conflict }) => {
// };

// const transformDataDeleteInsert = ({ mutation, conflict }) => {
// };

// const transformDataDeleteDelete = ({ mutation, conflict }) => {
// };

// const isInsert = mutation => mutation.data.type === 'insert';
// const isDelete = mutation => mutation.data.type === 'delete';

const transformData = ({ mutation, conflict }) => {
  // if (isInsert(mutation) && isInsert(conflict)) {
  return transformDataInsertInsert({ mutation, conflict });
  // }
  // if (isInsert(mutation) && isDelete(conflict)) {
  //   return transformDataInsertDelete({ mutation, conflict });
  // }
  // if (isDelete(mutation) && isInsert(conflict)) {
  //   return transformDataDeleteInsert({ mutation, conflict });
  // }
  // return transformDataDeleteDelete({ mutation, conflict });
};

const getState = ({ author, origin }) => {
  const result = { ...origin };
  result[author] += 1;
  return result;
};

const transformMutation = (mutation, conflict) => {
  const result = { ...mutation };
  result.origin = getState(conflict);
  result.data = transformData({ mutation, conflict });
  return result;
};

module.exports = transformMutation;
