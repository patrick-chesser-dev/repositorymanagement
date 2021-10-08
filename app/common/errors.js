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
