const uuidv1 = require('uuid/v1');

const generateId = () => uuidv1(); // ⇨ '3b99e3e0-7598-11e8-90be-95472fb3ecbd'

module.exports = generateId;
