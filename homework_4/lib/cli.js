/*
 * CLI-related tasks
 *
 */

// Dependencies
const readline = require('readline');
const util = require('util');
const debug = util.debuglog('cli');
const events = require('events');
class _events extends events{}
const e = new _events();
const os = require('os');
const v8 = require('v8');
const _data = require('./data');
const helpers = require('./helpers');

// Instantiate the cli module object
const cli = {};

// Input handlers
e.on('help',function() {
    cli.responders.help();
});
e.on('exit',function() {
    cli.responders.exit();
});
e.on('menu',function() {
    cli.responders.menu();
});
e.on('recent orders',function() {
    cli.responders.listRecentOrders();
});
e.on('order info',function(str) {
    cli.responders.orderInfo(str);
});
e.on('recent users',function() {
    cli.responders.listRecentUsers();
});
e.on('user info',function(str) {
    cli.responders.moreUserInfo(str);
});

// Responders object
cli.responders = {};

// Help / Man
cli.responders.help = function() {
    // Codify the commands and their explanations
    const commands = {
        'exit' : 'Kill the CLI (and the rest of the application)',
        'help' : 'Show this help page',
        'menu' : 'Show menu items',
        'recent orders' : 'Show orders placed within last 24h',
        'order info --{orderId}' : 'Show details of a specified order',
        'recent users' : 'Show users that signed up within last 24h',
        'user info --{userEmail}' : 'Show details of a specified user',
    };

    // Show a header for the help page that is as wide as the screen
    cli.horizontalLine();
    cli.centered('CLI MANUAL');
    cli.horizontalLine();
    cli.verticalSpace(2);

    // Show each command, followed by its explanation, in white and yellow respectively
    for (let key in commands) {
        if (commands.hasOwnProperty(key)) {
            const value = commands[key];
            let line = '\x1b[33m'+key+'\x1b[0m';
            const padding = 60 - line.length;
            for (let i = 0; i < padding; i++) {
                line+=' ';
            }
            line+=value;
            console.log(line);
            cli.verticalSpace();
        }
    }
    cli.verticalSpace(1);

    // End with another horizontal line
    cli.horizontalLine();

};

// Create a vertical space
cli.verticalSpace = function(lines) {
    lines = typeof(lines) == 'number' && lines > 0 ? lines : 1;
    for (i = 0; i < lines; i++) {
        console.log('');
    }
};

// Create a horizontal line across the screen
cli.horizontalLine = function() {

    // Get the available screen size
    const width = process.stdout.columns;

    // Put in enough dashes to go across the screen
    let line = '';
    for (i = 0; i < width; i++) {
        line+='-';
    }
    console.log(line);
};

// Create centered text on the screen
cli.centered = function(str) {
    str = typeof(str) === 'string' && str.trim().length > 0 ? str.trim() : '';

    // Get the available screen size
    const width = process.stdout.columns;

    // Calculate the left padding there should be
    const leftPadding = Math.floor((width - str.length) / 2);

    // Put in left padded spaces before the string itself
    let line = '';
    for (i = 0; i < leftPadding; i++) {
        line+=' ';
    }
    line+= str;
    console.log(line);
};
// Exit
cli.responders.exit = function() {
    process.exit(0);
};
// List menu items
cli.responders.menu = function() {
    cli.verticalSpace();
    helpers.getMenu().forEach((pizza) => {
        console.log(`Lovely ${pizza.name} for just ${pizza.price}`);
        cli.verticalSpace();
    })
};

// List recent orders placed within last 24h
cli.responders.listRecentOrders = function() {
    cli.horizontalLine();
    cli.centered('PURCHASES MADE IN THE LAST 24H (empty if none)');
    cli.horizontalLine();
    cli.verticalSpace(1);
    _data.list('purchases', function(err, purchaseIds) {
        if (!err && purchaseIds && purchaseIds.length > 0) {
            cli.verticalSpace();
            purchaseIds.forEach((purchaseId) => {
                if (new Date(Date.now() - Number(purchaseId)).getMinutes() < 1440) {
                    console.log(`Purchase id: ${purchaseId} has been made in the last 24 h`)
                }
            });
        }
    });
};

// Order info by order id
cli.responders.orderInfo = function(str) {
    // Get ID from string
    const arr = str.split('--');
    const purchaseId = typeof(arr[1]) === 'string' && arr[1].trim().length > 0 ? arr[1].trim() : false;
    if (purchaseId) {
        // Lookup the purchase
        _data.read('purchases', purchaseId,function(err, purchaseData){
            if (!err && purchaseData) {
                // Print their JSON object with text highlighting
                cli.verticalSpace();
                console.dir(purchaseData,{'colors' : true});
                cli.verticalSpace();
            }
        });
    }
};

// List Users that signed up within the last 24h
cli.responders.listRecentUsers = function() {
    cli.horizontalLine();
    cli.centered('USERS THAT SIGNED UP IN THE LAST 24H (empty if none)');
    cli.horizontalLine();
    cli.verticalSpace(1);
    _data.list('users', function(err, userIds) {
        if (!err && userIds && userIds.length > 0) {
            cli.verticalSpace();
            userIds.forEach((userId) => {
                _data.read('users', userId, function(err, userData) {
                    if (!err && userData) {
                        _data.recentlyCreatedFile('users', userId, 24, function(err, isRecent) {
                            if (!err && isRecent) {
                               console.log(`Name: ${userData.firstName} ${userData.lastName} Email: ${userData.email}`);
                           }
                        });
                    }
                });
            });
        }
    });
};

// More user info
cli.responders.moreUserInfo = function(str) {
    // Get email from string
    const arr = str.split('--');
    const userEmail = typeof(arr[1]) === 'string' && arr[1].trim().length > 0 ? arr[1].trim() : false;
    if (userEmail) {
        // Lookup the user
        _data.read('users', userEmail,function(err, userData){
            if (!err && userData) {
                // Remove the hashed password
                delete userData.hashedPassword;

                // Print their JSON object with text highlighting
                cli.verticalSpace();
                console.dir(userData,{'colors' : true});
                cli.verticalSpace();
            }
        });
    }

};

// Input processor
cli.processInput = function(str) {
    str = typeof(str) === 'string' && str.trim().length > 0 ? str.trim() : false;
    // Only process the input if the user actually wrote something, otherwise ignore it
    if (str) {
        // Codify the unique strings that identify the different unique questions allowed be the asked
        const uniqueInputs = [
            'help',
            'exit',
            'menu',
            'recent orders', // last 24 hours
            'order info', // by order id
            'recent users', // last 24 hours signups
            'user info', // by email
        ];

        // Go through the possible inputs, emit event when a match is found
        let matchFound = false;
        const counter = 0;
        uniqueInputs.some(function(input) {
            if (str.toLowerCase().indexOf(input) > -1) {
                matchFound = true;
                // Emit event matching the unique input, and include the full string given
                e.emit(input, str);
                return true;
            }
        });

        // If no match is found, tell the user to try again
        if (!matchFound) {
            console.log("Sorry, try again");
        }

    }
};

// Init script
cli.init = function() {

    // Send start message to console, in dark blue
    console.log('\x1b[34m%s\x1b[0m','The CLI is running');

    // Start the interface (prompt user we're waiting for an input)
    const _interface = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: '>'
    });

    // Create an initial prompt
    _interface.prompt();

    // Handle each line of input separately
    _interface.on('line', function(str) {
        // Send to the input processor
        cli.processInput(str);

        // Re-initialize the prompt afterwards
        _interface.prompt();
    });

    // If the user stops the CLI, kill the associated process
    _interface.on('close', function() {
        process.exit(0);
    });

};

// Export the module
module.exports = cli;