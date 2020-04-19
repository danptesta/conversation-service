/* eslint-disable arrow-body-style */
const getState = require('./get-state');

const transformDataInsertInsert = ({ mutation, conflict }) => {
  const result = { ...mutation.data };
  if (conflict.data.index <= mutation.data.index) {
    result.index += conflict.data.text.length;
  }
  return result;
};

const transformDataDeleteInsert = ({ mutation, conflict }) => {
  const result = { ...mutation.data };
  if (conflict.data.index <= mutation.data.index) {
    result.index += conflict.data.text.length;
  }
  return result;
};

const transformDataInsertDelete = ({ mutation, conflict }) => {
  const result = { ...mutation.data };
  if (conflict.data.index <= mutation.data.index) {
    const shifted = mutation.data.index - conflict.data.length;
    result.index = (shifted > 0) ? shifted : 0;
  }
  return result;
};

const transformDataDeleteDelete = ({ mutation, conflict }) => {
  const result = { ...mutation.data };
  if (conflict.data.index <= mutation.data.index) {
    const shifted = mutation.data.index - conflict.data.length;
    if (shifted < 0) {
      // original intended string has already been truncated.
      // adjust length accordingly to only delete the remainder of the truncated section of text.
      result.length -= shifted;
      result.index = 0;
    } else {
      result.index = shifted;
    }
  }
  return result;
};

const isInsert = mutation => mutation.data.type === 'insert';
const isDelete = mutation => mutation.data.type === 'delete';

const transformData = ({ mutation, conflict }) => {
  if (isInsert(mutation) && isInsert(conflict)) {
    return transformDataInsertInsert({ mutation, conflict });
  }
  if (isInsert(mutation) && isDelete(conflict)) {
    return transformDataInsertDelete({ mutation, conflict });
  }
  if (isDelete(mutation) && isInsert(conflict)) {
    return transformDataDeleteInsert({ mutation, conflict });
  }
  return transformDataDeleteDelete({ mutation, conflict });
};

const transformMutation = (mutation, conflict) => {
  const result = { ...mutation };
  result.origin = getState(conflict);
  result.data = transformData({ mutation, conflict });
  return result;
};

module.exports = transformMutation;
