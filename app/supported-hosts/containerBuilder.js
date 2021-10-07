const awilix = require('awilix');
const { S3 } = require('aws-sdk');
const { SupportedHostsRepo } = require('./supportedHostsRepo');
const { SupportedHostsService } = require('./supportedHostsService');
const { ResponseBuilder } = require('../common/responseBuilder');

class ContainerBuilder {
    #registerInfrastructure(container) {
        container.register({
            s3: awilix.asValue(new S3({ apiVersion: '2006-03-01' })),
            responseBuilder: awilix.asClass(ResponseBuilder)
        });
    }

    #registerRepos(container) {
        container.register({
            supportedHostsRepo: awilix.asClass(SupportedHostsRepo)
        });
    }

    #registerServices(container) {
        container.register({
            supportedHostsService: awilix.asClass(SupportedHostsService)
        });
    }

    buildContainer() {
        const container = awilix.createContainer({ injectionMode: awilix.InjectionMode.CLASSIC });
        this.#registerInfrastructure(container);
        this.#registerRepos(container);
        this.#registerServices(container);

        return container;
    }
}

exports.ContainerBuilder = ContainerBuilder;
