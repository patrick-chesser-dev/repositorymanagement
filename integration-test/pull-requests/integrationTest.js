'use strict';

(async() => {
    const { ContainerBuilder } = require('../../app/common/containerBuilder');
    const { Handler } = require('../../app/pull-requests/handler');
    const { IocRegistrationService } = require('../../app/pull-requests/iocRegistrationService');

    const containerBuilder = new ContainerBuilder();
    const regSvc = new IocRegistrationService();
    const container = containerBuilder.buildContainer(regSvc.registerInfrastructure, () => {}, regSvc.registerServices);

    const handler = new Handler(container);
    console.log('handling request');
    const event = {
        queryStringParameters: {
            sourceurl: 'https://github.com/dotnet/ef6',
            status: 'open',
            countonly: 'true'
        }
    };
    const result = await handler.handleRequest(event);

    console.log(JSON.stringify(result));
})();
