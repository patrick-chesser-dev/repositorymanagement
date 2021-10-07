class Handler {
    #container = null;
    constructor(container) {
        this.#container = container;
    }

    handleRequest() {
        const { supportedHostsService, responseBuilder } = this.#container.cradle;
        try {
            const result = supportedHostsService.getSupportedHosts();
            return responseBuilder.buildResponse(result, 200);
        } catch (ex) {
            console.error(`Error retrieving supported hosts. Error: ${ex.stack}`);
            return responseBuilder.buildResponse('Unexpected error retrieving supported hosts', 500);
        }
    }
}
exports.Handler = Handler;
