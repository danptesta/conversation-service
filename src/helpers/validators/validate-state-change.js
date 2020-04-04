const {
  InvalidPropertyError,
} = require('../errors');

const isValidateStateChange = ({ currentState, supportedCurrentStates }) => {
  const supportedCurrentStatesSet = new Set(supportedCurrentStates);
  return supportedCurrentStatesSet.has(currentState);
};

const validateStateChange = ({
  field, currentState, supportedCurrentStates, newState,
}) => {
  if (!isValidateStateChange({ currentState, supportedCurrentStates })) {
    throw new InvalidPropertyError(`Current ${field} must be (${supportedCurrentStates.join(' | ')}) in order to be changed to (${newState}).`);
  }
};

module.exports = validateStateChange;
