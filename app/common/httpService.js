class HttpService {
    #axios = null;

    constructor(axios) {
        this.#axios = axios;
    }

    async unAuthenticatedGet(requestUrl) {
        try {
            return await this.#axios.get(requestUrl);
        } catch (ex) {
            console.error(`Unexpected error received when attempting to get pull requests. Error ${ex.stack}`);
            throw ex;
        }
    }
}

exports.HttpService = HttpService;
