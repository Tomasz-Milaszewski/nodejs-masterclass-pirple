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
const _logs = require('./logs');
const helpers = require('./helpers');
const childProcess = require('child_process');

// Instantiate the cli module object
const cli = {};

// Input handlers
e.on('man',function() {
    cli.responders.help();
});
e.on('help',function() {
    cli.responders.help();
});
e.on('exit',function() {
    cli.responders.exit();
});
e.on('stats',function() {
    cli.responders.stats();
});
e.on('list users',function() {
    cli.responders.listUsers();
});
e.on('more user info',function(str) {
    cli.responders.moreUserInfo(str);
});
e.on('list checks',function(str) {
    cli.responders.listChecks(str);
});
e.on('more check info',function(str) {
    cli.responders.moreCheckInfo(str);
});
e.on('list logs',function() {
    cli.responders.listLogs();
});
e.on('more log info',function(str) {
    cli.responders.moreLogInfo(str);
});

// Responders object
cli.responders = {};

// Help / Man
cli.responders.help = function() {
    // Codify the commands and their explanations
    const commands = {
        'exit' : 'Kill the CLI (and the rest of the application)',
        'man' : 'Show this help page',
        'help' : 'Alias of the "man" command',
        'stats' : 'Get statistics on the underlying operating system and resource utilization',
        'List users' : 'Show a list of all the registered (undeleted) users in the system',
        'More user info --{userId}' : 'Show details of a specified user',
        'List checks --up --down' : 'Show a list of all the active checks in the system, including their state. The "--up" and "--down flags are both optional."',
        'More check info --{checkId}' : 'Show details of a specified check',
        'List logs' : 'Show a list of all the log files available to be read (compressed and uncompressed)',
        'More log info --{logFileName}' : 'Show details of a specified log file',
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
// Stats
cli.responders.stats = function() {
    // Compile an object of stats
    const stats = {
        'Load Average' : os.loadavg().join(' '),
        'CPU Count' : os.cpus().length,
        'Free Memory' : os.freemem(),
        'Current Malloced Memory' : v8.getHeapStatistics().malloced_memory,
        'Peak Malloced Memory' : v8.getHeapStatistics().peak_malloced_memory,
        'Allocated Heap Used (%)' : Math.round((v8.getHeapStatistics().used_heap_size / v8.getHeapStatistics().total_heap_size) * 100),
        'Available Heap Allocated (%)' : Math.round((v8.getHeapStatistics().total_heap_size / v8.getHeapStatistics().heap_size_limit) * 100),
        'Uptime' : os.uptime()+' Seconds'
    };

    // Create a header for the stats
    cli.horizontalLine();
    cli.centered('SYSTEM STATISTICS');
    cli.horizontalLine();
    cli.verticalSpace(2);

    // Log out each stat
    for (let key in stats) {
        if (stats.hasOwnProperty(key)) {
            const value = stats[key];
            let line = '\x1b[33m'+key+'\x1b[0m';
            const padding = 60 - line.length;
            for (i = 0; i < padding; i++) {
                line+=' ';
            }
            line+=value;
            console.log(line);
            cli.verticalSpace();
        }
    }

    // Create a footer for the stats
    cli.verticalSpace();
    cli.horizontalLine();
};
// List Users
cli.responders.listUsers = function() {
    _data.list('users', function(err, userIds) {
        if (!err && userIds && userIds.length > 0) {
            cli.verticalSpace();
            userIds.forEach(function(userId) {
                _data.read('users', userId, function(err, userData) {
                    if (!err && userData) {
                        let line = 'Name: '+userData.firstName+' '+userData.lastName+' Phone: '+userData.phone+' Checks: ';
                        const numberOfChecks = typeof(userData.checks) === 'object' && userData.checks instanceof Array && userData.checks.length > 0 ? userData.checks.length : 0;
                        line+=numberOfChecks;
                        console.log(line);
                        cli.verticalSpace();
                    }
                });
            });
        }
    });
};
// More user info
cli.responders.moreUserInfo = function(str) {
    // Get ID from string
    const arr = str.split('--');
    const userId = typeof(arr[1]) === 'string' && arr[1].trim().length > 0 ? arr[1].trim() : false;
    if (userId) {
        // Lookup the user
        _data.read('users', userId,function(err,userData){
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
// List Checks
cli.responders.listChecks = function(str) {
    _data.list('checks',function(err, checkIds) {
        if (!err && checkIds && checkIds.length > 0) {
            cli.verticalSpace();
            checkIds.forEach(function(checkId) {
                _data.read('checks', checkId,function(err, checkData) {
                    if (!err && checkData) {
                        const includeCheck = false;
                        const lowerString = str.toLowerCase();
                        // Get the state, default to down
                        const state = typeof(checkData.state) === 'string' ? checkData.state : 'down';
                        // Get the state, default to unknown
                        const stateOrUnknown = typeof(checkData.state) === 'string' ? checkData.state : 'unknown';
                        // If the user has specified that state, or hasn't specified any state
                        if ((lowerString.indexOf('--'+state) > -1) || (lowerString.indexOf('--down') === -1 && lowerString.indexOf('--up') === -1)){
                            var line = 'ID: '+checkData.id+' '+checkData.method.toUpperCase()+' '+checkData.protocol+'://'+checkData.url+' State: '+stateOrUnknown;
                            console.log(line);
                            cli.verticalSpace();
                        }
                    }
                });
            });
        }
    });
};

// More check info
cli.responders.moreCheckInfo = function(str) {
    // Get ID from string
    const arr = str.split('--');
    const checkId = typeof(arr[1]) === 'string' && arr[1].trim().length > 0 ? arr[1].trim() : false;
    if (checkId) {
        // Lookup the user
        _data.read('checks', checkId,function(err, checkData) {
            if (!err && checkData) {
                // Print their JSON object with text highlighting
                cli.verticalSpace();
                console.dir(checkData,{'colors' : true});
                cli.verticalSpace();
            }
        });
    }
};

// List Logs
cli.responders.listLogs = function() {
    cli.verticalSpace();
    var ls = childProcess.spawn('ls', ['./.logs/']);
    ls.stdout.on('data', function(dataObj) {
        // Explode into separate lines
        const dataStr = dataObj.toString();
        const logFileNames = dataStr.split('\n');
        logFileNames.forEach(function(logFileName){
            if (typeof(logFileName) === 'string' && logFileName.trim().length > 0 && logFileName.indexOf('-') > -1) {
                console.log(logFileName.trim().split('.')[0]);
                cli.verticalSpace();
            }
        });
    });
};

// More logs info
cli.responders.moreLogInfo = function(str) {
    // Get logFileName from string
    const arr = str.split('--');
    const logFileName = typeof(arr[1]) === 'string' && arr[1].trim().length > 0 ? arr[1].trim() : false;
    if (logFileName) {
        cli.verticalSpace();
        // Decompress it
        _logs.decompress(logFileName,function(err, strData) {
            if (!err && strData) {
                // Split it into lines
                const arr = strData.split('\n');
                arr.forEach(function(jsonString){
                    const logObject = helpers.parseJsonToObject(jsonString);
                    if (logObject && JSON.stringify(logObject) !== '{}') {
                        console.dir(logObject,{'colors' : true});
                        cli.verticalSpace();
                    }
                });
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
            'man',
            'help',
            'exit',
            'stats',
            'list users',
            'more user info',
            'list checks',
            'more check info',
            'list logs',
            'more log info'
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
        prompt: ''
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