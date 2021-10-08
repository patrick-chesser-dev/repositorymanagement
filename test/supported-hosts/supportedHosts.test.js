const Sut = require('../../app/supported-hosts/supportedHostsService').SupportedHostsService;
const SupportedHostsRepo = require('../../app/supported-hosts/supportedHostsRepo').SupportedHostsRepo;

const buildMockRepo = supportedHosts => {
    jest.mock('../../app/supported-hosts/supportedHostsRepo', supportedHosts => {
        return jest.fn().mockImplementation(() => {
            return { getSupportedHosts: () => supportedHosts }
        });
    });

    return new SupportedHostsRepo(null);
}

test('supported repos should equal "github"', async () => {
    const expected = [{
        host: 'github',
        url: 'https://github.com'
    }];

    const mockRepo = buildMockRepo(expected)
    const sut = new Sut(mockRepo);

    expect(sut.getSupportedHosts()).toEqual(expected);
});