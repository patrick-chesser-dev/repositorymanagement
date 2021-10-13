const Sut = require('../../app/common/httpService').HttpService;
const axios = require('axios');
const { NullArgumentError } = require('../../app/common/errors');

jest.mock('axios');

describe('httpService happy path tests', () => {
    test('get should return expected success response and data', async () => {
        const expectedResponse = {
            status: 200,
            data: [{ abc: 123 }]
        };
        axios.get.mockResolvedValue(expectedResponse);

        const sut = new Sut(axios);
        const result = await sut.unAuthenticatedGet('https://example.com');

        expect(result).toEqual(expectedResponse);
    });
});

describe('httpService negative tests', () => {
    class TestError extends Error{
        constructor(message) {
            super(message);
            this.name = 'testError';
            this.response = {
                status: 404
            }
        }
    }
    test('get should return error response if get throws', async () => {
        const mockAxios = {
            get: async () => { throw new TestError; }
        };

        const sut = new Sut(mockAxios);
        const result = await sut.unAuthenticatedGet('https://shouldthrow.com');
        expect(result.status).toEqual(404);
    });

    test('get should throw NullArgumentError if axios is null', async () => {

        const sut =

            await expect(async () => new Sut()).rejects.toThrow(NullArgumentError);
    });
});