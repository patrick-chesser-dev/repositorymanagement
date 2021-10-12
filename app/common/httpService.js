const { NullArgumentError } = require('../common/errors');
class HttpService {
    #axios = null;

    constructor(axios) {
        if (!axios) {
            throw new NullArgumentError('axios cannot be null');
        }
        this.#axios = axios;
    }

    async unAuthenticatedGet(requestUrl) {
        if (!requestUrl) {
            throw new NullArgumentError('requestUrl cannot be null');
        }
        try {
            return await this.#axios.get(requestUrl);
        } catch (ex) {
            console.log(ex);
            console.error(`Unexpected error received when attempting to get pull requests. Error ${ex.stack}`);
            return ex.response;
        }
    }
}

exports.HttpService = HttpService;
