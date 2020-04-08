class InvalidInputError extends Error {
  constructor(errors) {
    super('Invalid input');
    this.name = 'InvalidInputError';
    this.errors = errors;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidInputError);
    }
  }
}

class InvalidPropertyError extends Error {
  constructor(msg) {
    super(msg);
    this.name = 'InvalidPropertyError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidPropertyError);
    }
  }
}

class ConversationNotFoundError extends Error {
  constructor() {
    super('conversation not found');

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ConversationNotFoundError);
    }
  }
}

class SystemError extends Error {
  constructor(msg) {
    super(msg);
    this.name = 'SystemError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SystemError);
    }
  }
}

module.exports = {
  InvalidInputError,
  InvalidPropertyError,
  ConversationNotFoundError,
  SystemError,
};
