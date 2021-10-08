const awilix = require('awilix');
const { S3 } = require('aws-sdk');
const { SupportedHostsRepo } = require('./supportedHostsRepo');
const { SupportedHostsService } = require('./supportedHostsService');
const { ResponseBuilder } = require('../common/responseBuilder');

class IocRegistrationService {
    registerInfrastructure(container) {
        container.register({
            s3: awilix.asValue(new S3({ apiVersion: '2006-03-01' })),
            responseBuilder: awilix.asClass(ResponseBuilder)
        });
    }

    registerRepos(container) {
        container.register({
            supportedHostsRepo: awilix.asClass(SupportedHostsRepo)
        });
    }

    registerServices(container) {
        container.register({
            supportedHostsService: awilix.asClass(SupportedHostsService)
        });
    }
}

exports.IocRegistrationService = IocRegistrationService;
