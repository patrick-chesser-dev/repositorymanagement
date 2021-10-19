const Sut = require('../../app/pull-requests/gitHubPullRequestsService').GitHubPullRequestsService;

jest.mock('../../app/common/httpService');
const { HttpService } = require('../../app/common/httpService');
const { NullArgumentError, ErrorResponseError, NotFoundError, InvalidArgumentError } = require('../../app/common/errors');

const buildMockHttpService = (generator) => {
    HttpService.mockImplementation(() => {
        return {
            unAuthenticatedGet: (url) => generator(url)
        };
    });

    return new HttpService();
};

describe('GitHubPullRequestsService Happy Path Tests', () => {
    test('valid repo, with 3 open pull requests, with 3 commits per pull request, should return count of 9 for single page per call', async () => {
        const goodUrl = new URL('https://github.com/user/repo/');
        const isCountOnly = 'true';
        const status = 'open';
        const dataGenerator = (url) => {
            if (!url.toString().includes('commits')) {
                return {
                    data: [{ commits_url: 'https://github.com/user/repo/commits/1' }, { commits_url: 'https://github.com/user/repo/commits/2' }, { commits_url: 'https://github.com/user/repo/commits/3' }],
                    status: 200
                };
            } else {
                return {
                    status: 200,
                    data: ['commit1', 'commit2', 'commit3']
                }
            }
        };
        const mockHttpService = buildMockHttpService(dataGenerator);

        const sut = new Sut(mockHttpService);
        const result = await sut.getPullRequestCommits(goodUrl, status, isCountOnly);
        expect(result).toEqual({ commitsCount: 9 });
    });

    test('valid repo, with non alpha numeric chars, with 3 open pull requests, with 3 commits per pull request, should return count of 9 for single page per call', async () => {
        const goodUrl = new URL('https://github.com/patrick-chesser-dev/repo/');
        const isCountOnly = 'true';
        const status = 'open';
        const dataGenerator = (url) => {
            if (!url.toString().includes('commits')) {
                return {
                    data: [{ commits_url: 'https://github.com/user/repo/commits/1' }, { commits_url: 'https://github.com/user/repo/commits/2' }, { commits_url: 'https://github.com/user/repo/commits/3' }],
                    status: 200
                };
            } else {
                return {
                    status: 200,
                    data: ['commit1', 'commit2', 'commit3']
                }
            }
        };
        const mockHttpService = buildMockHttpService(dataGenerator);

        const sut = new Sut(mockHttpService);
        const result = await sut.getPullRequestCommits(goodUrl, status, isCountOnly);
        expect(result).toEqual({ commitsCount: 9 });
    });

    function* twoPageGenerator(data, firstPageIndex, secondPageIndex) {
        yield data.slice(0, firstPageIndex);
        yield data.slice(firstPageIndex, secondPageIndex);
        yield [];
    }

    const createPagedArray = (commitsCount) => {
        const data = [];
        for (let i = 0; i < commitsCount; i++) {
            data.push(`commit${i}`);
        }

        return data;
    };

    test('valid repo should return expected results for multiple full pages and a blank page', async () => {
        const goodUrl = new URL('https://github.com/user/repo/');
        const isCountOnly = 'true';
        const status = 'open';

        const commitsDataGenerator = twoPageGenerator(createPagedArray(200), 100, 200);
        const returnFunction = (url) => {
            if (!url.toString().includes('commits')) {
                return {
                    data: [{ commits_url: 'https://github.com/user/repo/commits/1' }],
                    status: 200
                };
            } else {
                return {
                    status: 200,
                    data: commitsDataGenerator.next().value
                }
            }
        };

        const mockHttpService = buildMockHttpService(returnFunction);

        const sut = new Sut(mockHttpService);
        const result = await sut.getPullRequestCommits(goodUrl, status, isCountOnly);
        expect(result).toEqual({ commitsCount: 200 });
    });

    test('valid repo should return expected results for a full page and a partial page', async () => {
        const goodUrl = new URL('https://github.com/user/repo/');
        const isCountOnly = 'true';
        const status = 'open';

        const commitsDataGenerator = twoPageGenerator(createPagedArray(150), 100, 150);
        const returnFunction = (url) => {
            if (!url.toString().includes('commits')) {
                return {
                    data: [{ commits_url: 'https://github.com/user/repo/commits/1' }],
                    status: 200
                };
            } else {
                return {
                    status: 200,
                    data: commitsDataGenerator.next().value
                }
            }
        };

        const mockHttpService = buildMockHttpService(returnFunction);

        const sut = new Sut(mockHttpService);
        const result = await sut.getPullRequestCommits(goodUrl, status, isCountOnly);
        expect(result).toEqual({ commitsCount: 150 });
    });

    test('valid repo should return 0 for a page with no open pull requests', async () => {
        const goodUrl = new URL('https://github.com/user/repo/');
        const isCountOnly = 'true';
        const status = 'open';

        const returnFunction = () => {
            return {
                data: [],
                status: 200
            };
        };

        const mockHttpService = buildMockHttpService(returnFunction);

        const sut = new Sut(mockHttpService);
        const result = await sut.getPullRequestCommits(goodUrl, status, isCountOnly);
        expect(result).toEqual({ commitsCount: 0 });
    });
});

describe('GitHubPullRequestsService Negative Tests', () => {

    test('missing url shold throw NullArgumentError', async () => {
        const url = null
        const isCountOnly = 'true';
        const status = 'open';

        const dataGenerator = () => {
            return {
                status: 404,
                data: []
            };
        };
        const mockHttpService = buildMockHttpService(dataGenerator);
        const sut = new Sut(mockHttpService);
        expect(async () => await sut.getPullRequestCommits(url, status, isCountOnly)).rejects.toThrow(NullArgumentError);
    });

    test('404 from GitHub should throw NotFoundError', async () => {
        const url = new URL('https://github.com/user/repo/');
        const isCountOnly = 'true';
        const status = 'open';

        const dataGenerator = () => {
            return {
                status: 404,
                data: []
            };
        };
        const mockHttpService = buildMockHttpService(dataGenerator);
        const sut = new Sut(mockHttpService);
        expect(async () => await sut.getPullRequestCommits(url, status, isCountOnly)).rejects.toThrow(NotFoundError);
    });

    test('Non 404 from GitHub should throw ErrorResponseError', async () => {
        const url = new URL('https://github.com/user/repo/');
        const isCountOnly = 'true';
        const status = 'open';

        const dataGenerator = () => {
            return {
                status: 418,
                data: []
            };
        };
        const mockHttpService = buildMockHttpService(dataGenerator);
        const sut = new Sut(mockHttpService);
        expect(async () => await sut.getPullRequestCommits(url, status, isCountOnly)).rejects.toThrow(ErrorResponseError);
    });

    test('supplied status of anything but open should throw InvalidArgumentError', async () => {
        const url = new URL('https://github.com/user/repo/');
        const isCountOnly = 'true';
        const status = 'closed';

        const dataGenerator = () => {
            return {
                status: 200,
                data: []
            };
        };
        const mockHttpService = buildMockHttpService(dataGenerator);
        const sut = new Sut(mockHttpService);

        expect(async () => await sut.getPullRequestCommits(url, status, isCountOnly)).rejects.toThrow(InvalidArgumentError);
    });

    test('missing status should throw NullArgumentError', async () => {
        const url = new URL('https://github.com/user/repo/');
        const isCountOnly = 'true';

        const dataGenerator = () => {
            return {
                status: 200,
                data: []
            };
        };
        const mockHttpService = buildMockHttpService(dataGenerator);
        const sut = new Sut(mockHttpService);
        expect(async () => await sut.getPullRequestCommits(url, null, isCountOnly)).rejects.toThrow(NullArgumentError);
    });


    test('missing countonly should throw NullArgumentError', async () => {
        const url = new URL('https://github.com/user/repo/');
        const status = 'open';

        const dataGenerator = () => {
            return {
                status: 200,
                data: []
            };
        };
        const mockHttpService = buildMockHttpService(dataGenerator);
        const sut = new Sut(mockHttpService);
        expect(async () => await sut.getPullRequestCommits(url, status, null)).rejects.toThrow(NullArgumentError);
    });

    test('supplied countonly of anything but true should throw InvalidArgumentError', async () => {
        const url = new URL('https://github.com/user/repo/');
        const isCountOnly = 'false';
        const status = 'open';

        const dataGenerator = () => {
            return {
                status: 200,
                data: []
            };
        };
        const mockHttpService = buildMockHttpService(dataGenerator);
        const sut = new Sut(mockHttpService);

        expect(async () => await sut.getPullRequestCommits(url, status, isCountOnly)).rejects.toThrow(InvalidArgumentError);
    });

    test('null http service should throw NullArgumentError', () => {
        expect(() => new Sut()).toThrow(NullArgumentError);
    });
});