const Sut = require('../../app/supported-hosts/supportedHostsService').SupportedHostsService;
jest.mock('../../app/supported-hosts/supportedHostsRepo');
const { SupportedHostsRepo } = require('../../app/supported-hosts/supportedHostsRepo');

const setupMockRepo = mockSupportedHosts => {
    SupportedHostsRepo.mockImplementation(() => {
        return {
            getSupportedHosts: () => mockSupportedHosts
        };
    });
};

test('supported repos should equal "github"', async () => {
    const expected = [
        {
            host: 'github',
            url: 'https://github.com'
        },
        {
            host: 'gitlab',
            url: 'https://gitlab.com'
        }
    ];
    setupMockRepo(expected);
    const mockRepo = new SupportedHostsRepo();
    const sut = new Sut(mockRepo);

    expect(sut.getSupportedHosts()).toEqual(expected);
});
