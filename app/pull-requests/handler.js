const { InvalidArgumentError, NullArgumentError, NotFoundError } = require('../common/errors');

class Handler {
    #container = null;
    constructor(container) {
        this.#container = container;
    }

    async handleRequest(event) {
        console.log(JSON.stringify(event));
        const { serviceFactory, responseBuilder } = this.#container.cradle;
        try {
            // Future: add determination rules class to determine what function needs to be invoked
            // for now, only supporting getOpenPullRequestCount
            const service = serviceFactory.resolveService(event.sourceurl);
            const result = await service.getOpenPullRequestCount(new URL(event.sourceurl));
            return responseBuilder.buildResponse({ openPullRequestCount: result }, 200);

        } catch (ex) {
            if (ex instanceof InvalidArgumentError || ex instanceof NullArgumentError) {
                console.error(`Unprocessable Request. Bad Argument input. Error: ${ex.stack}`);
                return responseBuilder.buildResponse({ status: 'Unprocessable' }, 422);
            } else if (ex instanceof NotFoundError) {
                console.error(`Repo could not be found. Error: ${ex.stack}`);
                return responseBuilder.buildResponse({ status: 'Not Found' }, 404);
            } else {
                console.error(`Error retrieving supported hosts. Error: ${ex.stack}`);
                return responseBuilder.buildResponse('Unexpected error retrieving supported hosts', 500);
            }
        }
    }
}
exports.Handler = Handler;
