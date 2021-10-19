class NullArgumentError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NullArgumentError';
    }
}
exports.NullArgumentError = NullArgumentError;

class UnsupportedHostError extends Error {
    constructor(message) {
        super(message);
        this.name = 'UnsupportedHostError';
    }
}
exports.UnsupportedHostError = UnsupportedHostError;

class InvalidArgumentError extends Error {
    constructor(message) {
        super(message);
        this.name = 'InvalidArgumentError';
    }
}
exports.InvalidArgumentError = InvalidArgumentError;

class ErrorResponseError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ErrorResponseError';
    }
}
exports.ErrorResponseError = ErrorResponseError;

class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NotFoundError';
    }
}
exports.NotFoundError = NotFoundError;

class RateLimitExceededError extends Error {
    constructor(message) {
        super(message);
        this.name = 'RateLimitExceededError';
    }
}
exports.RateLimitExceededError = RateLimitExceededError;
