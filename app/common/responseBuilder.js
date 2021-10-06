class ResponseBuilder {

    buildResponse(responseBody, statusCode) {
        return {
            headers: {
                'Content-Type': 'application/json'
            },
            statusCode: statusCode,
            body: JSON.stringify(responseBody)
        };
    }
}

exports.ResponseBuilder = ResponseBuilder;
