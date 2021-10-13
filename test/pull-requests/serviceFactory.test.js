const Sut = require('../../app/pull-requests/serviceFactory').ServiceFactory;
jest.mock('../../app/common/httpService');
const { HttpService } = require('../../app/common/httpService');
const { GitHubPullRequestsService } = require('../../app/pull-requests/gitHubPullRequestsService');
const { InvalidArgumentError, NullArgumentError, UnsupportedHostError } = require('../../app/common/errors');

 test('url with valid github host should return githubPullRequestService', () => {
    const goodUrl = "https://github.com/user/repo";
    const svc = new GitHubPullRequestsService(new HttpService());
    const sut = new Sut(svc);

    const result = sut.resolveService(goodUrl);
    expect(result).toEqual(svc);
});

test('url with valid any other host should throw UnsupportedHostError', () => {
    const unsupportedUrl = "https://gitlab.com/user/repo";
    const svc = new GitHubPullRequestsService(new HttpService());

    const sut = new Sut(svc);
    expect(() => sut.resolveService(unsupportedUrl)).toThrow(UnsupportedHostError);

});

test('bad url should throw InvalidArgumentError', () => {
    const badUrl = "notEvenAUrl";
    const svc = new GitHubPullRequestsService(new HttpService());

    const sut = new Sut(svc);
    expect(() => sut.resolveService(badUrl)).toThrow(InvalidArgumentError);

});


test('null url should throw NullArgumentError', () => {
    const svc = new GitHubPullRequestsService(new HttpService());

    const sut = new Sut(svc);
    expect(() => sut.resolveService(null)).toThrow(NullArgumentError);

});

test('null container should throw NullArgumentError', () => {
    expect(() => new Sut()).toThrow(NullArgumentError);
});