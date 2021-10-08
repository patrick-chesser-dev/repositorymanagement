const Sut = require('../../app/common/httpService').HttpService;
const axios = require('axios');
const { NullArgumentError } = require('../../app/common/errors');

jest.mock('axios');

describe('httpService Happy Path Tests', () => {
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

describe('axios negative tests', () => {

    test('get should throw if an unexpected error occurs', async () => {
        const mockAxios = {
            get: async () => { throw new Error("Can't Connect"); }
        };

        const sut = new Sut(mockAxios);

        await expect(async () => { await sut.unAuthenticatedGet('https://shouldthrow.com'); }).rejects.toThrow();
    });

    test('get should throw NullArgumentError if axios is null', async () => {

        const sut =

            await expect(async () => new Sut()).rejects.toThrow(NullArgumentError);
    });
});