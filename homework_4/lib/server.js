/*
 * Server-related tasks
 *
 */

// Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const fs = require('fs');
const handlers = require('./handlers');
const helpers = require('./helpers');
const path = require('path');
const util = require('util');
const debug = util.debuglog('server');

// Instantiate the server module object
const server = {};

// Instantiate the HTTP server
server.httpServer = http.createServer(function(req,res) {
    server.unifiedServer(req, res);
});

// Instantiate the HTTPS server
server.httpsServerOptions = {
    key: fs.readFileSync(path.join(__dirname, '/../https/key.pem')),
    cert: fs.readFileSync(path.join(__dirname, '/../https/cert.pem')),
};
server.httpsServer = https.createServer(server.httpsServerOptions, function(req,res) {
    server.unifiedServer(req, res);
});

// All the server logic for both http and https server
server.unifiedServer = function(req, res) {

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
        let chosenHandler = typeof(server.router[trimmedPath]) !== 'undefined' ? server.router[trimmedPath] : handlers.notFound;

        // If the request is within the public directory use to the public handler instead
        chosenHandler = trimmedPath.indexOf('public/') > -1 ? handlers.public : chosenHandler;

        // Construct the data object to send to the handler
        const data = {
            trimmedPath,
            queryStringObject,
            method,
            headers,
            payload: helpers.parseJsonToObject(buffer),
        };

        // Route the request to the handler specified in the router
        chosenHandler(data, function(statusCode, payload, contentType) {
            // Determine the type of response (fallback to JSON)
            contentType = typeof(contentType) === 'string' ? contentType : 'json'

            // Use the status code called back by the handler or default to 200
            const statusCodeToBeSentBack = typeof(statusCode) === 'number' ? statusCode : 200;

            // Return the response parts that are content-specific
            let payloadString = '';

            if (contentType === 'json') {
                res.setHeader('Content-Type', 'application/json');
                const payloadToBeSentBack = typeof(payload) === 'object' ? payload : {};
                payloadString = JSON.stringify(payloadToBeSentBack);
            }
            if (contentType === 'html') {
                res.setHeader('Content-Type', 'text/html');
                payloadString = typeof(payload) === 'string' ? payload : '';
            }
            if (contentType === 'favicon') {
                res.setHeader('Content-Type', 'image/x-icon');
                payloadString = typeof(payload) !== 'undefined' ? payload : '';
            }
            if (contentType === 'css') {
                res.setHeader('Content-Type', 'text/css');
                payloadString = typeof(payload) !== 'undefined' ? payload : '';
            }
            if (contentType === 'png') {
                res.setHeader('Content-Type', 'image/png');
                payloadString = typeof(payload) !== 'undefined' ? payload : '';
            }
            if (contentType === 'jpg') {
                res.setHeader('Content-Type', 'image/jpeg');
                payloadString = typeof (payload) !== 'undefined' ? payload : '';
            }
            if (contentType === 'plain') {
                res.setHeader('Content-Type', 'text/plain');
                payloadString = typeof(payload) !== 'undefined' ? payload : '';
            }

            // Return the response
            res.writeHead(statusCodeToBeSentBack);
            res.end(payloadString);

            // If the response is 200 print green, otherwise print red
            if (statusCode === 200) {
                debug('\x1b[32m%s\x1b[0m',method.toUpperCase()+' /'+trimmedPath+' '+statusCode);
            } else {
                debug('\x1b[31m%s\x1b[0m',method.toUpperCase()+' /'+trimmedPath+' '+statusCode);
            }
        });
    });
};

// Define a request router
server.router = {
    '': handlers.index,
    'account/create': handlers.accountCreate,
    'session/create': handlers.sessionCreate,
    'session/deleted': handlers.sessionDeleted,
    'menu': handlers.menuPage,
    'purchase': handlers.purchasePage,
    'thank': handlers.thankYouPage,
    'api/users': handlers.users,
    'api/tokens': handlers.tokens,
    'api/menu': handlers.menu,
    'api/cart': handlers.cart,
    'api/purchase': handlers.purchase,
};

// Init script
server.init = function() {
    // Start the HTTP server
    server.httpServer.listen(config.env.httpPort, function() {
        console.log('\x1b[36m%s\x1b[0m','The HTTP server is running on port '+config.env.httpPort);
    });

    // Start the https server
    server.httpsServer.listen(config.env.httpsPort, function() {
        console.log('\x1b[35m%s\x1b[0m','The HTTPS server is running on port '+config.env.httpsPort);
    });
};

// Export the module
module.exports = server;
