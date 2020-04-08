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

class EntityNotFoundError extends Error {
  constructor(entity) {
    super(`${entity} not found`);
    this.name = 'EntityNotFoundError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, EntityNotFoundError);
    }
  }
}

class ConversationNotFoundError extends EntityNotFoundError {
  constructor() {
    super('conversation');
    this.name = 'ConversationNotFoundError';

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
  EntityNotFoundError,
  ConversationNotFoundError,
  SystemError,
};
