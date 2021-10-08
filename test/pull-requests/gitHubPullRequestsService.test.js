const Sut = require('../../app/pull-requests/gitHubPullRequestsService').GitHubPullRequestsService;

jest.mock('../../app/common/httpService');
const { HttpService } = require('../../app/common/httpService');
const { InvalidArgumentError, NullArgumentError, UnsupportedHostError, ErrorResponseError, NotFoundError } = require('../../app/common/errors');

const buildMockHttpService = (generator) => {
    HttpService.mockImplementation(() => {
        return {
            unAuthenticatedGet: (url) => generator()
        };
    });

    return new HttpService();
};

describe('GitHubPullRequestsService Happy Path Tests', () => {
    test('valid repo should return expected results for single page', async () => {
        const goodUrl = new URL("https://github.com/user/repo/");
        const dataGenerator = () => {
            return {
                data: [1, 2, 3],
                status: 200
            };
        }
        const mockHttpService = buildMockHttpService(dataGenerator);

        const sut = new Sut(mockHttpService);
        const result = await sut.getOpenPullRequestCount(goodUrl);
        expect(result).toEqual(3);
    });

    function* twoPageGenerator(data, firstPageIndex, secondPageIndex) {
        yield data.slice(0, firstPageIndex);
        yield data.slice(firstPageIndex, secondPageIndex);
        yield [];
    }

    test('valid repo should return expected results for multiple full pages and a blank page', async () => {
        const goodUrl = new URL("https://github.com/user/repo/");

        const dataGenerator = twoPageGenerator([...Array(200).keys()], 100, 200);
        const returnFunction = () => {
            return {
                data: dataGenerator.next().value,
                status: 200
            };
        };

        const mockHttpService = buildMockHttpService(returnFunction);

        const sut = new Sut(mockHttpService);
        const result = await sut.getOpenPullRequestCount(goodUrl);
        expect(result).toEqual(200);
    });

    test('valid repo should return expected results for a full page and a partial page', async () => {
        const goodUrl = new URL("https://github.com/user/repo/");

        const dataGenerator = twoPageGenerator([...Array(150).keys()], 100, 150);
        const returnFunction = () => {
            return {
                data: dataGenerator.next().value,
                status: 200
            };
        };

        const mockHttpService = buildMockHttpService(returnFunction);

        const sut = new Sut(mockHttpService);
        const result = await sut.getOpenPullRequestCount(goodUrl);
        expect(result).toEqual(150);
    });

    test('valid repo should return 0 for a page with no open pull requests', async () => {
        const goodUrl = new URL("https://github.com/user/repo/");

        const returnFunction = () => {
            return {
                data: [],
                status: 200
            };
        };

        const mockHttpService = buildMockHttpService(returnFunction);

        const sut = new Sut(mockHttpService);
        const result = await sut.getOpenPullRequestCount(goodUrl);
        expect(result).toEqual(0);
    });
});

describe('GitHubPullRequestsService Negative Tests', () => {
    test('invalid pathname should throw InvalidArgumentError', () => {
        const badUrl = new URL("https://github.com/user/repo/abc123");

        const sut = new Sut({});
        expect(async () => await sut.getOpenPullRequestCount(badUrl)).rejects.toThrow(InvalidArgumentError);

    });

    test('404 from GitHub should throw NotFoundError', async () => {
        const url = new URL("https://github.com/user/repo/");
        const dataGenerator = () => {
            return {
                status: 404,
                data: []
            };
        };
        const mockHttpService = buildMockHttpService(dataGenerator);
        const sut = new Sut(mockHttpService);
        expect(async () => await sut.getOpenPullRequestCount(url)).rejects.toThrow(NotFoundError);
    });

    test('Non 404 from GitHub should throw ErrorResponseError', async () => {
        const url = new URL("https://github.com/user/repo/");
        const dataGenerator = () => {
            return {
                status: 418,
                data: []
            };
        };
        const mockHttpService = buildMockHttpService(dataGenerator);
        const sut = new Sut(mockHttpService);
        expect(async () => await sut.getOpenPullRequestCount(url)).rejects.toThrow(ErrorResponseError);
    });

    test('null http service should throw NullArgumentError', () => {
        expect(() => new Sut()).toThrow(NullArgumentError);
    });
});