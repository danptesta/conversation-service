class UniqueConstraintError extends Error {
  constructor(value) {
    super(`${value} must be unique.`);
    this.name = 'UniqueConstraintError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UniqueConstraintError);
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

class RequiredParameterError extends Error {
  constructor(param) {
    super(`Missing required fields: ${param}`);
    this.name = 'RequiredParameterError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RequiredParameterError);
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
  UniqueConstraintError,
  InvalidPropertyError,
  InvalidInputError,
  RequiredParameterError,
  SystemError,
};
