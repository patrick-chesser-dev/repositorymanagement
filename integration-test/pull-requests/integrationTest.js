'use strict';

const { ContainerBuilder } = require('../../app/common/containerBuilder');
const { Handler } = require('../../app/pull-requests/handler');
const { IocRegistrationService } = require('../../app/pull-requests/iocRegistrationService');

const containerBuilder = new ContainerBuilder();
const regSvc = new IocRegistrationService();
const container = containerBuilder.buildContainer(regSvc.registerInfrastructure, () => {}, regSvc.registerServices);

const handler = new Handler(container);

const result = async() => {
    return await handler.handleRequest({ sourceurl: 'https://github.com/patrick-chesser-dev/repositorymanagement' });
};

console.log(JSON.stringify(result));
