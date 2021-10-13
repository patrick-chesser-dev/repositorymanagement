const awilix = require('awilix');

// This would be a good use case for TypeScript and an Interface
class ContainerBuilder {

    buildContainer(registerInfrastructure, registerRepos, registerServices) {

        const container = awilix.createContainer({ injectionMode: awilix.InjectionMode.CLASSIC });

        registerInfrastructure(container);
        registerRepos(container);
        registerServices(container);

        return container;
    }
}

exports.ContainerBuilder = ContainerBuilder;
