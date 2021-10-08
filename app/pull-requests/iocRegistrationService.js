const awilix = require('awilix');
const axios = require('axios');
const { HttpService } = require('../common/httpService');
const { ServiceFactory } = require('./serviceFactory');
const { GitHubPullRequestsService } = require('./gitHubPullRequestsService');
const { ResponseBuilder } = require('../common/responseBuilder');
const { Lifetime } = require('awilix');

class IocRegistrationService {
    registerInfrastructure(container) {
        container.register({
            axios: awilix.asValue(axios),
            httpService: awilix.asClass(HttpService),
            responseBuilder: awilix.asClass(ResponseBuilder, { lifetime: Lifetime.SINGLETON })
        });
    }

    registerServices(container) {
        container.register({
            gitHubPullRequestsService: awilix.asClass(GitHubPullRequestsService),
            serviceFactory: awilix.asClass(ServiceFactory, { lifetime: Lifetime.SINGLETON })
        });
    }
}

exports.IocRegistrationService = IocRegistrationService;
