const { ContainerBuilder } = require('../common/containerBuilder');
const { Handler } = require('./handler');
const { IocRegistrationService } = require('./iocRegistrationService');

const containerBuilder = new ContainerBuilder();
const iocRegistrationService = new IocRegistrationService();
const container = containerBuilder.buildContainer(iocRegistrationService.registerInfrastructure, iocRegistrationService.registerRepos, iocRegistrationService.registerServices);
const entryPoint = new Handler(container);

exports.FunctionHandler = entryPoint.HandleRequest;
