const { NullArgumentError, ErrorResponseError, NotFoundError, InvalidArgumentError } = require('../common/errors');

class GitHubPullRequestsService {
    #maxPageSize = 100;
    #baseUrl = 'https://api.github.com/repos';
    #httpService = null;

    constructor(httpService) {
        if (!httpService) {
            throw new NullArgumentError('httpService cannot be null');
        }

        this.#httpService = httpService;
    }

    // this is where type script interfaces would be handy
    // any service should implement this interface to start
    async getPullRequests(repoUrl, status, isCountOnly) {

        this.#validateInputs(status, isCountOnly);

        let morePages = true;
        let pullRequests = [];

        if (!repoUrl) {
            throw new NullArgumentError('repoUrl cannot be null');
        }

        const url = `${this.#baseUrl}${repoUrl.pathname}/pulls?per_page=${this.#maxPageSize}&status=${status}`;
        let count = 1;
        do {
            const response = await this.#httpService.unAuthenticatedGet(`${url}&page=${count}`);
            this.#validateResponse(response, repoUrl);
            pullRequests = pullRequests.concat(response.data);

            if (response.data.length === this.#maxPageSize) {
                ++count;
            } else {
                morePages = false;
            }

        } while (morePages);

        return isCountOnly ? { pullRequestsCount: pullRequests.length } : { pullRequests: pullRequests };
    }

    #validateInputs(status, isCountOnly) {
        if (!status) {
            console.error('Error: status is missing from query input');
            throw new NullArgumentError('status must be present on query');
        }
        if (status.toLowerCase() !== 'open') {
            console.error(`Error: request for unsupported status: ${status}`);
            throw new InvalidArgumentError('status must be present on query');
        }
        if (!isCountOnly) {
            console.error('Error: countonly is missing from query input');
            throw new NullArgumentError('status must be present on query');
        }
        if (isCountOnly.toLowerCase() !== 'true') {
            console.error(`Error: countonly param not supplied or set to an invalid input. isCountOnly: ${isCountOnly}`);
            throw new InvalidArgumentError('countonly must be present on query and set to true');
        }
    }

    #validateResponse(response, repoUrl) {
        if (response.status === 404) {
            throw new NotFoundError('Error response received when calling github.');
        }
        if (response.status < 200 || response.status > 299) {
            console.log(`Error response when querying github api. URL: ${repoUrl.toString()}. Response: ${JSON.stringify(response)}`);
            throw new ErrorResponseError('Error response received when calling github.');
        }
    }
}

exports.GitHubPullRequestsService = GitHubPullRequestsService;
