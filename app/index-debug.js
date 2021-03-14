/*
* Primary file for the API
*
*/

// Dependencies
const server = require('./lib/server');
const workers = require('./lib/workers');
const cli = require('./lib/cli');
const exampleDebuggingProblem = require('./lib/exampleDebuggingProblem');

// Declare the app
const app = {};

// Init function
app.init = function() {
    // Start the server
    debugger;
    server.init();
    debugger;

    // Start the workers
    debugger;
    workers.init();
    debugger;

    // Start CLI, but make sure it starts last
    debugger;
    setTimeout(function() {
        cli.init();
        debugger;
    }, 50);
    debugger;

    // Start an example script that has issues (throws an error)
    debugger;
    // Set foo at 1
    let foo = 1;
    console.log("Just assigned 1 to foo");
    debugger;

    // Increment foo
    foo++;
    console.log("Just incremented foo");
    debugger;

    // Square foo
    foo = foo * foo;
    console.log("Just multipled foo by itself");
    debugger;

    // Convert foo to a string
    foo = foo.toString();
    console.log("Just changed foo to a string");
    debugger;

    // Call the init script that will throw
    exampleDebuggingProblem.init();
    debugger;
};

// Execute
app.init();

// Export the app
module.exports = app;
