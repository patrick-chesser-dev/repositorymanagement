const Sut = require('../../app/pull-requests/serviceFactory').ServiceFactory;
const { GitHubPullRequestsService } = require('../../app/pull-requests/gitHubPullRequestsService');
const { HttpService } = require('../../app/common/httpService');
const { InvalidArgumentError, NullArgumentError, UnsupportedHostError } = require('../../app/common/errors');

const buildMockContainer = () => {
    return {
        resolve: () => {
            return new GitHubPullRequestsService(new HttpService());
        }
    }
}

test('url with valid github host should return githubPullRequestService', () => {
    const goodUrl = "https://github.com/user/repo";
    const container = buildMockContainer();

    const sut = new Sut(container);
    const result = sut.resolveService(goodUrl);
    expect(result).toEqual(container.resolve());
});

test('url with valid any other host should throw UnsupportedHostError', () => {
    const unsupportedUrl = "https://gitlab.com/user/repo";
    const container = buildMockContainer();

    const sut = new Sut(container);
    expect(() => sut.resolveService(unsupportedUrl)).toThrow(UnsupportedHostError);

});

test('bad url should throw InvalidArgumentError', () => {
    const badUrl = "notEvenAUrl";
    const container = buildMockContainer();

    const sut = new Sut(container);
    expect(() => sut.resolveService(badUrl)).toThrow(InvalidArgumentError);

});

test('null url should throw NullArgumentError', () => {
    const container = buildMockContainer();

    const sut = new Sut(container);
    expect(() => sut.resolveService(null)).toThrow(NullArgumentError);

});

test('null container should throw NullArgumentError', () => {
    expect(() => new Sut()).toThrow(NullArgumentError);
});