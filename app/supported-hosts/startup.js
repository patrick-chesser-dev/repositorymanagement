const { ContainerBuilder } = require('./containerBuilder');
const { Handler } = require('./handler');

const containerBuilder = new ContainerBuilder();

const entryPoint = new Handler(containerBuilder.buildContainer());

exports.FunctionHandler = entryPoint.HandleRequest;
