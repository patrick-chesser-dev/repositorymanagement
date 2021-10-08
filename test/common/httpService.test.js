const Sut = require('../../app/common/httpService').HttpService;
const axios = jest.createMockFromModule('axios');

// I'm too new to JEST to get the mock working for this package, so using a hand-rolled mock
const buildMockAxios = response => {
    return { get: async () => response }
};

test('get should return expected success response and data', async () => {
    const expectedResponse = {
        status: 200,
        data: [ {abc: 123 }]
    };

    const mockAxios = buildMockAxios(expectedResponse);

    const sut = new Sut(mockAxios);
    const result = await sut.unAuthenticatedGet('https://example.com');

    expect(result).toEqual(expectedResponse);
});

test('get should throw if an unexpected error occurs', async () => {
    const mockAxios = {
        get: async() => { throw new Error("Can't Connect"); }
    };

    const sut = new Sut(mockAxios);

    await expect(async () => { await sut.unAuthenticatedGet('https://shouldthrow.com'); }).rejects.toThrow();
});