const { NullArgumentError, InvalidArgumentError, ErrorResponseError, NotFoundError } = require('../common/errors');

class GitHubPullRequestsService {
    #maxPageSize = 100;
    #baseUrl = 'https://api.github.com/repos';
    #httpService = null;

    constructor(httpsService) {
        if (!httpsService) {
            throw new NullArgumentError('httpsService cannot be null');
        }

        this.#httpService = httpsService;
    }

    async getOpenPullRequestCount(repoUrl) {
        let morePages = true;
        let openPullRequests = [];

        if (!repoUrl) {
            throw new NullArgumentError('repoUrl cannot be null');
        }

        this.#validateUrlPath(repoUrl);
        const url = `${this.#baseUrl}/${repoUrl.pathname}?per_page=${this.#maxPageSize}&status=open`;
        let count = 1;
        do {
            const response = await this.#httpService.unAuthenticatedGet(`${url}&page=${count}`);
            this.#validateResponse(response, repoUrl);
            openPullRequests = openPullRequests.concat(response.data);

            if (response.data.length === this.#maxPageSize) {
                ++count;
            } else {
                morePages = false;
            }

        } while (morePages);

        return openPullRequests.length;
    }

    #validateUrlPath(repoUrl) {
        // match pattern of /{repo}/{owner}/
        const split = repoUrl.pathname.split('/');
        if (split.length !== 4) { // blank, owner, repo, blank
            console.error(`Url pathname is not in expected format of /{repo}/{owner}/. Pathname: ${repoUrl.pathname}`);
            throw new InvalidArgumentError(`Url pathname is not in expected format of /{repo}/{owner}/. Pathname: ${repoUrl.pathname}`);
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
