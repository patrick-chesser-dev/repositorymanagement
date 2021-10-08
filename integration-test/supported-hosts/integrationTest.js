'use strict';

const { ContainerBuilder } = require('../../app/common/containerBuilder');
const { Handler } = require('../../app/supported-hosts/handler');
const { IocRegistrationService } = require('../../app/supported-hosts/iocRegistrationService');

const containerBuilder = new ContainerBuilder();
const regSvc = new IocRegistrationService();
const container = containerBuilder.buildContainer(regSvc.registerInfrastructure, regSvc.registerRepos, regSvc.registerServices);
const handler = new Handler(container);

const result = handler.handleRequest();

console.log(JSON.stringify(result));
