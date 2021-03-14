/*
* Homework_6 API using Cluster
*
*/

// Dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const cluster = require('cluster');
const os = require('os');

// Instantiate the HTTP server
const httpServer = http.createServer(function(req,res) {
    // Get the url and parse it
    const parsedUrl = url.parse(req.url, true);

    // Get the path
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g,'');

    // Get the query string as an object
    const queryStringObject = parsedUrl.query;

    // Get the HTTP Method
    const method = req.method.toLowerCase();

    // Get the headers as an object
    const headers = req.headers;

    // Get the payload, if any
    const decoder = new StringDecoder('utf-8');
    let buffer = '';
    req.on('data', function(data) {
        buffer += decoder.write(data);
    });
    req.on('end', function() {
        buffer += decoder.end();

        // Choose the handler this request should go to. If not found => use notFound
        const chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        // Construct the data object to send to the handler
        const data = {
            trimmedPath,
            queryStringObject,
            method,
            headers,
            payload: buffer,
        };

        // Route the request to the handler specified in the router
        chosenHandler(data, function(statusCode) {
            // Use the status code called back by the handler or default to 200
            const statusCodeToBeSentBack = typeof(statusCode) === 'number' ? statusCode : 200;

            // Prepare response
            const response = statusCode === 200 ? {'hello': 'world'} : {};

            // Convert response to JSON
            const responseJson = JSON.stringify(response);

            // Return the response and statusCode
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCodeToBeSentBack);
            res.end(responseJson);
        });
    });
});

// If we're on the master thread, take some rest
if (cluster.isMaster) {
    // Fork the process
    for (let i = 0; i < os.cpus().length; i++) {
        cluster.fork();
    }
} else {
    // If we're not on the master thread, start the HTTP server
    httpServer.listen(3000, function() {
        console.log('The server is listening now on port 3000');
    });
}

// Define handlers
const handlers = {};

// Hello handler
handlers.hello = function(data, callback) {
    callback(200);
};

// Not found handler
handlers.notFound = function(data, callback) {
    callback(404);
};

// Define a request router
const router = {
    'hello': handlers.hello,
};
