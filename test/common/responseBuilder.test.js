const Sut = require('../../app/common/responseBuilder').ResponseBuilder;

test('buildResponse should build the expected success response', () => {
    const responseBody = [
        {
            host: 'github',
            expectedUrlFormat: 'https://github.com/{owner}/{repository}'
        },
        {
            host: 'gitlab',
            expectedUrl: 'https://bitbucket.com/{workspace}/{repo_slug}'
        }
    ];
    const statusCode = 200;        
    
    const expected = {
        headers: {
            'Content-Type': 'application/json'
        },
        statusCode: statusCode,
        body: JSON.stringify(responseBody)
    };

    const sut = new Sut();

    expect(sut.buildResponse(responseBody, statusCode)).toEqual(expected);
});

test('buildResponse should build the expected success response', () => {
    const responseBody = "Unexpected Exception"
    const statusCode = 500;        
    
    const expected = {
        headers: {
            'Content-Type': 'application/json'
        },
        statusCode: statusCode,
        body: JSON.stringify(responseBody)
    };

    const sut = new Sut();

    expect(sut.buildResponse(responseBody, statusCode)).toEqual(expected);
});