exports.handler = (event, context, callback) => {
    console.log("Received an event!");
    console.log("Method: ", event.httpMethod);
    console.log("Body: ", event.body);
    console.log("Path Parameters: ", event.pathParameters);
    let result = {
        method: event.httpMethod,
        body: event.body,
        pathParameters: event.pathParameters
    };
    callback(null, {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify(result)
    });
};