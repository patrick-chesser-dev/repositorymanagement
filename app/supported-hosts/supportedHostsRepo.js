class SupportedHostsRepo {
    constructor(s3) {
        this.s3 = s3;
    }

    getSupportedHosts() {
        return {
            host: 'github',
            url: 'https://github.com'
        };
    }

}

exports.SupportedHostsRepo = SupportedHostsRepo;
