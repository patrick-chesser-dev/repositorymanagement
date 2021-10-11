const { UnsupportedHostError, NullArgumentError, InvalidArgumentError } = require('../common/errors');

class ServiceFactory {
    #serviceMap = new Map();

    constructor(gitHubPullRequestsService) {
        if (!gitHubPullRequestsService) {
            throw new NullArgumentError('container cannot be null');
        }
        this.#serviceMap = new Map();
        this.#serviceMap.set('github.com', gitHubPullRequestsService);
    }

    resolveService(urlString) {
        let url = null;

        if (!urlString) {
            throw new NullArgumentError('urlString cannot be null');
        }

        try {
            url = new URL(urlString);
        } catch (error) {
            throw new InvalidArgumentError('Invalid url provided');
        }

        if (!this.#serviceMap.has(url.host)) {
            console.error(`Attempt to manage unsupported host. Url ${urlString}`);
            throw new UnsupportedHostError(`No supported provided for ${urlString}`);
        }

        return this.#serviceMap.get(url.host);
    }
}

exports.ServiceFactory = ServiceFactory;
