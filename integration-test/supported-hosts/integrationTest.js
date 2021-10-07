'use strict';

const { ContainerBuilder } = require('../../app/supported-hosts/containerBuilder');
const { Handler } = require('../../app/supported-hosts/handler');

const containerBuilder = new ContainerBuilder();
const handler = new Handler(containerBuilder.buildContainer());

const result = handler.handleRequest();

console.log(JSON.stringify(result));
