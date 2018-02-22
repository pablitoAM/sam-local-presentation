const http = require("http");
const urlParser = require("url");
const path = require("path");

const API_URL = process.env.API_URL;

const postToApi = (id, payload) => {

    return new Promise((resolve, reject) => {
        
        let url = urlParser.parse(API_URL, true, true);
        let options = { 
            hostname: url.hostname,
            port: url.port,
            path: path.join(url.path, `${id}`),
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            }
        };    
        let request = http.request(options, (response) => {
            response.setEncoding("utf-8");
            let body = "";
            
            response.on("data", (chunk) => {
                body += chunk;
            });            
            
            response.on("end", () => {
                let status = response.statusCode;
                console.log(`Status: ${status}, Response: ${body}`);
                if(status >= 400){
                    reject({status, body});
                }
                resolve({status, body});
            });
        });
        request.on("error", (error) => {
            reject(error);
        });

        request.write(JSON.stringify(payload.event));
        request.end();
    });
};

const prepareResponse = (statusCode, body) => ({
    statusCode: statusCode,
    headers: {
        "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify(body)
});

exports.handler = (event, context, callback) => {    
    console.log("Received Event: ", event);
    postToApi(1234, {
        key: event.Records[0].s3.object.key,
        event: event.Records[0].eventName 
    })
        .then(response => {
            console.log("Response from API: ", response);
            callback(null, prepareResponse(response.statusCode, response.body));
        })
        .catch(error => {
            console.error("Error", error);
            callback(null, prepareResponse(500, error));
        });
};