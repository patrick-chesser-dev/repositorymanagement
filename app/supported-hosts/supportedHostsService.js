class SupportedHostsService {
    constructor(supportedHostsRepo) {
        this.repo = supportedHostsRepo;
    }

    getSupportedHosts() {
        return this.repo.getSupportedHosts();
    }
}

exports.SupportedHostsService = SupportedHostsService;
