/*
 * Request handlers
 *
 */

// Dependencies
const _data = require('./data');
const helpers = require('./helpers');
const config = require('./config');
const _url = require('url');
const dns = require('dns');
const _performance = require('perf_hooks').performance;
const util = require('util');
const debug = util.debug('performance');

// Define the handlers
const handlers = {};

/*
 * HTML Handlers
 *
 */

// Index handlers
handlers.index = function(data, callback) {
    // Reject not GET requests
    if (data.method === 'get') {
        // Prepare data for interpolation
        const templateData = {
            'head.title': 'Uptime Monitoring - Made Simple',
            'head.description': 'We offer free, simple uptime monitoring for HTTP/HTTPS sites all kinds. When your site goes down, we\'ll send you a text to let you know',
            'body.class': 'index',
        };

        // Read in a template as a string
        helpers.getTemplate('index', templateData, function(err, templateString) {
            if (!err && templateString) {
                // Add the universal header and footer
                helpers.addUniversalTemplates(templateString, templateData, function(err, str) {
                    if (!err && str) {
                        // Return the page as html
                        callback(200, str, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    }
                });
            } else {
                callback(500, undefined, 'html');
            }
        })
    } else {
        callback(405, undefined, 'html');
    }
}

// Create Account
handlers.accountCreate = function(data, callback) {
    // Reject any request that isn't a GET
    if (data.method === 'get') {
        // Prepare data for interpolation
        var templateData = {
            'head.title' : 'Create an Account',
            'head.description' : 'Signup is easy and only takes a few seconds.',
            'body.class' : 'accountCreate'
        };
        // Read in a template as a string
        helpers.getTemplate('accountCreate', templateData,function(err, str) {
            if (!err && str) {
                // Add the universal header and footer
                helpers.addUniversalTemplates(str, templateData,function(err, str) {
                    if (!err && str) {
                        // Return that page as HTML
                        callback(200, str, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    }
                });
            } else {
                callback(500, undefined, 'html');
            }
        });
    } else {
        callback(405, undefined, 'html');
    }
};

// Create Session
handlers.sessionCreate = function(data, callback) {
    // Reject any request that isn't a GET
    if (data.method === 'get') {
        // Prepare data for interpolation
        var templateData = {
            'head.title' : 'Log in to your account',
            'head.description' : 'Please enter your phone number and password to enter',
            'body.class' : 'sessionCreate'
        };
        // Read in a template as a string
        helpers.getTemplate('sessionCreate', templateData,function(err, str) {
            if (!err && str) {
                // Add the universal header and footer
                helpers.addUniversalTemplates(str, templateData,function(err, str) {
                    if (!err && str) {
                        // Return that page as HTML
                        callback(200, str, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    }
                });
            } else {
                callback(500, undefined, 'html');
            }
        });
    } else {
        callback(405, undefined, 'html');
    }
};

// Session has been deleted
handlers.sessionDeleted = function(data, callback) {
    // Reject any request that isn't a GET
    if (data.method === 'get') {
        // Prepare data for interpolation
        var templateData = {
            'head.title' : 'Logged out',
            'head.description' : 'You have been logged out of your account',
            'body.class' : 'sessionDeleted'
        };
        // Read in a template as a string
        helpers.getTemplate('sessionDeleted', templateData,function(err, str) {
            if (!err && str) {
                // Add the universal header and footer
                helpers.addUniversalTemplates(str, templateData,function(err, str) {
                    if (!err && str) {
                        // Return that page as HTML
                        callback(200, str, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    }
                });
            } else {
                callback(500, undefined, 'html');
            }
        });
    } else {
        callback(405, undefined, 'html');
    }
};

// Edit account
handlers.accountEdit = function(data, callback) {
    // Reject any request that isn't a GET
    if (data.method === 'get') {
        // Prepare data for interpolation
        var templateData = {
            'head.title' : 'Account Settings',
            'body.class' : 'accountEdit'
        };
        // Read in a template as a string
        helpers.getTemplate('accountEdit', templateData,function(err, str) {
            if (!err && str) {
                // Add the universal header and footer
                helpers.addUniversalTemplates(str, templateData,function(err, str) {
                    if (!err && str) {
                        // Return that page as HTML
                        callback(200, str, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    }
                });
            } else {
                callback(500, undefined, 'html');
            }
        });
    } else {
        callback(405, undefined, 'html');
    }
};

// Account has been deleted
handlers.accountDeleted = function(data, callback) {
    // Reject any request that isn't a GET
    if (data.method === 'get') {
        // Prepare data for interpolation
        var templateData = {
            'head.title' : 'Account Deleted',
            'head.description': 'You account has been deleted',
            'body.class' : 'accountDeleted'
        };
        // Read in a template as a string
        helpers.getTemplate('accountDeleted', templateData,function(err, str) {
            if (!err && str) {
                // Add the universal header and footer
                helpers.addUniversalTemplates(str, templateData,function(err, str) {
                    if (!err && str) {
                        // Return that page as HTML
                        callback(200, str, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    }
                });
            } else {
                callback(500, undefined, 'html');
            }
        });
    } else {
        callback(405, undefined, 'html');
    }
};

// Create a new check
handlers.checksCreate = function(data, callback) {
    // Reject any request that isn't a GET
    if (data.method === 'get') {
        // Prepare data for interpolation
        var templateData = {
            'head.title' : 'Create a new check',
            'body.class' : 'checksCreate'
        };
        // Read in a template as a string
        helpers.getTemplate('checksCreate', templateData,function(err, str) {
            if (!err && str) {
                // Add the universal header and footer
                helpers.addUniversalTemplates(str, templateData,function(err, str) {
                    if (!err && str) {
                        // Return that page as HTML
                        callback(200, str, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    }
                });
            } else {
                callback(500, undefined, 'html');
            }
        });
    } else {
        callback(405, undefined, 'html');
    }
};

// Dashboard (view all checks)
handlers.checksList = function(data, callback) {
    // Reject any request that isn't a GET
    if (data.method === 'get') {
        // Prepare data for interpolation
        var templateData = {
            'head.title' : 'Dashboard',
            'body.class' : 'checksList'
        };
        // Read in a template as a string
        helpers.getTemplate('checksList', templateData,function(err, str) {
            if (!err && str) {
                // Add the universal header and footer
                helpers.addUniversalTemplates(str, templateData,function(err, str) {
                    if (!err && str) {
                        // Return that page as HTML
                        callback(200, str, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    }
                });
            } else {
                callback(500, undefined, 'html');
            }
        });
    } else {
        callback(405, undefined, 'html');
    }
};

// Edit a check
handlers.checksEdit = function(data, callback) {
    // Reject any request that isn't a GET
    if (data.method === 'get') {
        // Prepare data for interpolation
        var templateData = {
            'head.title' : 'Check details',
            'body.class' : 'checksEdit'
        };
        // Read in a template as a string
        helpers.getTemplate('checksEdit', templateData,function(err, str) {
            if (!err && str) {
                // Add the universal header and footer
                helpers.addUniversalTemplates(str, templateData,function(err, str) {
                    if (!err && str) {
                        // Return that page as HTML
                        callback(200, str, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    }
                });
            } else {
                callback(500, undefined, 'html');
            }
        });
    } else {
        callback(405, undefined, 'html');
    }
};

// Favicon
handlers.favicon = function(data, callback) {
    // Reject any request that isn't a GET
    if (data.method === 'get') {
        // Read in the favicon's data
        helpers.getStaticAsset('favicon.ico',function(err, data) {
            if (!err && data) {
                // Callback the data
                callback(200, data, 'favicon');
            } else {
                callback(500);
            }
        });
    } else {
        callback(405);
    }
};

// Public assets
handlers.public = function(data, callback) {
    // Reject any request that isn't a GET
    if (data.method === 'get') {
        // Get the filename being requested
        const trimmedAssetName = data.trimmedPath.replace('public/','').trim();
        if (trimmedAssetName.length > 0) {
            // Read in the asset's data
            helpers.getStaticAsset(trimmedAssetName, function(err, data) {
                if (!err && data) {
                    // Determine the content type (default to plain text)
                    let contentType = 'plain';

                    if (trimmedAssetName.indexOf('.css') > -1) {
                        contentType = 'css';
                    }
                    if (trimmedAssetName.indexOf('.png') > -1) {
                        contentType = 'png';
                    }
                    if (trimmedAssetName.indexOf('.jpg') > -1) {
                        contentType = 'jpg';
                    }
                    if (trimmedAssetName.indexOf('.ico') > -1) {
                        contentType = 'favicon';
                    }
                    // Callback the data
                    callback(200, data, contentType);
                } else {
                    callback(404);
                }
            });
        } else {
            callback(404);
        }
    } else {
        callback(405);
    }
};

/*
 * JSON API Handlers
 *
 */

// Example error
handlers.exampleError = function(data, callback) {
    const err = new Error('This is an example error');
    throw(err);
};

// Users
handlers.users = function(data, callback) {
    const acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._users[data.method](data, callback);
    } else {
        callback(405);
    }
};

// Container for the users submethods
handlers._users = {};

// Users - post
// Required data: firstName, lastName, phone, password, tosAgreement
// Optional date: none
handlers._users.post = function(data, callback) {
    // Check that all required fields are filled out
    const firstName = typeof(data.payload.firstName) === 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    const lastName = typeof(data.payload.lastName) === 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    const phone = typeof(data.payload.phone) === 'string' && data.payload.phone.trim().length === 10 ? data.payload.phone.trim() : false;
    const password = typeof(data.payload.password) === 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    const tosAgreement = !!(typeof(data.payload.tosAgreement) === 'boolean' && data.payload.tosAgreement);

    if (firstName && lastName && phone && password && tosAgreement) {
        // Make sure that the user doesn't already exist, user phone used as unique identifier
        _data.read('users', phone, function(err, data) {
            if (err) {
                // Hash the password
                const hashedPassword = helpers.hash(password);

                // Create the user object
                if (hashedPassword) {
                    const userObject = {
                        firstName,
                        lastName,
                        phone,
                        hashedPassword,
                        tosAgreement,
                    };

                    // Store the user
                    _data.create('users', phone, userObject, function(err) {
                        if (!err) {
                            callback(200);
                        } else {
                            console.log(err);
                            callback(500, {'Error' : 'Could not create the new user'});
                        }
                    });
                } else {
                    callback(500, {'Error' : 'Could not hash the user password'});
                }
            } else {
                // User already exists
                callback(400, {'Error' : 'A user with that phone number already exists'});
            }
        });
    } else {
        callback(400, {'Error' : 'Missing required fields'});
    }
};

// Users - get
// Required date: phone
// Optional data: none
handlers._users.get = function(data, callback) {
    // Check that the phone number is valid
    const phone = typeof(data.queryStringObject.phone) === 'string' && data.queryStringObject.phone.trim().length > 0 ? data.queryStringObject.phone.trim() : false;
    if (phone) {
        // Get the token from the headers
        const token = typeof(data.headers.token) === 'string' ? data.headers.token : false;

        // Verify that the token from headers is valid for the phone number
        handlers._tokens.verifyToken(token, phone, function(tokenIsValid) {
            if (tokenIsValid) {
                // Lookup the user
                _data.read('users', phone, function(err, data) {
                    if (!err && data) {
                        // Remove the hashed password from the user object before returning it to the requester
                        delete data.hashedPassword;
                        callback(200, data);
                    } else {
                        callback(404);
                    }
                });
            } else {
                callback(403, {'Error' : 'Missing required token in header, or token invalid'})
            }
        });
    } else {
        callback(400, {'Error' : 'Missing required field'});
    }

};

// Users - put
// Required data: phone
// Optional data: firstName, lastName, password - at least one must be specified
handlers._users.put= function(data, callback) {
    // Check for the required field
    const phone = typeof(data.payload.phone) === 'string' && data.payload.phone.trim().length > 0 ? data.payload.phone.trim() : false;

    // Check for the optional fields
    const firstName = typeof(data.payload.firstName) === 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    const lastName = typeof(data.payload.lastName) === 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    const password = typeof(data.payload.password) === 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

    // Error if the phone is invalid
    if (phone) {
        // Error if nothing is sent to update
        if (firstName || lastName || password) {
            // Get the token from the headers
            const token = typeof(data.headers.token) === 'string' ? data.headers.token : false;

            // Verify that the token from headers is valid for the phone number
            handlers._tokens.verifyToken(token, phone, function(tokenIsValid) {
                if (tokenIsValid) {
                    // Lookup the user
                    _data.read('users', phone, function (err, userData) {
                        if (!err && userData) {
                            // Update the fields as necessary
                            if (firstName) {
                                userData.firstName = firstName;
                            }
                            if (lastName) {
                                userData.lastName = lastName;
                            }
                            if (password) {
                                userData.hashedPassword = helpers.hash(password);
                            }
                            // Store the new updates
                            _data.update('users', phone, userData, function (err) {
                                if (!err) {
                                    callback(200);
                                } else {
                                    console.log(err);
                                    callback(500, {'Error': 'Could not update the user'})
                                }
                            })
                        } else {
                            callback(400, {'Error': 'The specified user does not exist'});
                        }
                    })
                } else {
                    callback(403, {'Error': 'Missing required token in header, or token invalid'})
                }
            });
        } else {
            callback(400, {'Error' : 'Missing required fields to update'});
        }
    } else {
        callback(400, {'Error' : 'Missing required field'});
    }
};

// Users - delete
// Required field: phone
handlers._users.delete = function(data, callback) {
    // Check the phone number is valid
    const phone = typeof(data.queryStringObject.phone) === 'string' && data.queryStringObject.phone.trim().length > 0 ? data.queryStringObject.phone.trim() : false;
    if (phone) {
        // Get the token from the headers
        const token = typeof(data.headers.token) === 'string' ? data.headers.token : false;

        // Verify that the token from headers is valid for the phone number
        handlers._tokens.verifyToken(token, phone, function(tokenIsValid) {
            if (tokenIsValid) {
                // Lookup the user
                _data.read('users', phone, function (err, userData) {
                    if (!err && userData) {
                        _data.delete('users', phone, function (err) {
                            if (!err) {
                                // Delete each of the checks associated with the user
                                const userChecks = typeof(userData.checks) === 'object' && userData.checks instanceof Array ? userData.checks : [];
                                const checksToDelete = userChecks.length;
                                if (checksToDelete > 0) {
                                    let checksDeleted = 0;
                                    let deletionErrors = false;

                                    //Look through the checks
                                    userChecks.forEach(function(checkId) {
                                        // Delete the check
                                        _data.delete('checks', checkId, function(err) {
                                            if (err) {
                                                deletionErrors = true;
                                            }
                                            checksDeleted++;
                                            if (checksDeleted === checksToDelete) {
                                                if (!deletionErrors) {
                                                    callback(200);
                                                } else {
                                                    callback(500, {'Error' : 'Errors encountered while deleting users checks'});
                                                }
                                            }
                                        })
                                    })

                                } else {
                                    callback(200);
                                }
                            } else {
                                callback(500, {'Error': 'Could not delete the specified user'});
                            }
                        })
                    } else {
                        callback(400, {'Error': 'Could not find specified user'});
                    }
                });
            } else {
                callback(403, {'Error': 'Missing required token in header, or token invalid'})
            }
        });
    } else {
        callback(400, {'Error' : 'Missing required field'});
    }

};

// Tokens
handlers.tokens = function(data, callback) {
    const acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._tokens[data.method](data, callback);
    } else {
        callback(405);
    }
};

// Container for all the tokens methods
handlers._tokens = {};

// Tokens - post
// Required data: phone, password
// Optional data: none
handlers._tokens.post = function(data, callback) {
    _performance.mark('entered function');
    const phone = typeof(data.payload.phone) === 'string' && data.payload.phone.trim().length === 10 ? data.payload.phone.trim() : false;
    const password = typeof(data.payload.password) === 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    _performance.mark('inputs validated');
    if (phone && password) {
        // Lookup the user who matches that phone number
        _performance.mark('beginning user lookup');
        _data.read('users', phone, function(err, userData) {
            _performance.mark('user lookup complete');
            if (!err) {
                // Hash the sent password and compare it to the password stored in the user object
                _performance.mark('beginning password hashing');
                const hashedPassword = helpers.hash(password);
                _performance.mark('password hashing complete');
                if (hashedPassword === userData.hashedPassword) {
                    // If valid create a new token with a random name and expiration date 1 hour into the future
                    _performance.mark('creating data for token');
                    const tokenId = helpers.createRandomString(20);
                    const expires = Date.now() + 1000 * 60 * 60;
                    const tokenObject = {
                        phone,
                        id: tokenId,
                        expires,
                    };

                    // Store the token
                    _performance.mark('beginning storing token');
                    _data.create('tokens', tokenId, tokenObject, function(err) {
                        _performance.mark('storing token complete');

                        // Gather all the measurements
                        _performance.measure('Beginning to end', 'entered function', 'storing token complete');
                        _performance.measure('Validating user inputs', 'entered function', 'inputs validated');
                        _performance.measure('User lookup', 'beginning user lookup', 'user lookup complete');
                        _performance.measure('Password hashing', 'beginning password hashing', 'password hashing complete');
                        _performance.measure('Token data creation','creating data for token', 'beginning storing token');
                        _performance.measure('Token storing','beginning storing token', 'storing token complete');

                        // Log out all the measurements
                        const measurements = _performance.getEntriesByType('measure');
                        measurements.forEach(function(measurement) {
                            debug('\x1b[33m%s\x1b[0m',measurement.name+' '+measurement.duration);
                        });

                        if (!err) {
                            callback(200, tokenObject);
                        } else {
                            callback(500, {'Error' : 'Could not create the new token'});
                        }
                    })
                } else {
                    callback(400, {'Error' : 'Password did not match the specified user stored password'});
                }
            } else {
                callback(400, {'Error' : 'Could not find the specified user'});
            }
        });
    } else {
        callback(400, {'Error' : 'Missing required fields'});
    }

};

// Tokens - get
// Required data: id
// Optional data: none
handlers._tokens.get = function(data, callback) {
    // Check that id is valid
    const id = typeof(data.queryStringObject.id) === 'string' && data.queryStringObject.id.trim().length === 20 ? data.queryStringObject.id.trim() : false;
    if (id) {
        // Lookup the token
        _data.read('tokens', id, function(err, tokenData) {
            if (!err && tokenData) {
                callback(200, tokenData);
            } else {
                callback(404);
            }
        });
    } else {
        callback(400, {'Error' : 'Missing required field'});
    }
};

// Tokens - put
// Required data: id, extend
// Optional data: none
handlers._tokens.put = function(data, callback) {
    const id = typeof(data.payload.id) === 'string' && data.payload.id.trim().length === 20 ? data.payload.id.trim() : false;
    const extend = typeof(data.payload.extend) === 'boolean' && data.payload.extend === true;
    if (id && extend) {
        // Lookup the token
        _data.read('tokens', id, function(err, tokenData) {
            if (!err && tokenData) {
                // Check if the token isn't expired
                if (tokenData.expires > Date.now()) {
                    // Set the expiration an hour from now
                    tokenData.expires = Date.now() + 1000 * 60 * 60;

                    // Store the new updates
                    _data.update('tokens', id, tokenData, function(err) {
                        if (!err) {
                            callback(200);
                        } else {
                            callback(500, {'Error' : 'Could not update token expiration'});
                        }
                    });
                } else {
                    callback(400, {'Error' : 'Token has already expired and cannot be extended'});
                }
            } else {
                callback(400, {'Error' : 'Specified token does not exist'});
            }
        });
    } else {
        callback(400, {'Error' : 'Missing required fields or fields invalid'});
    }

};

// Tokens - delete
// Required data: id
// Optional data: none
handlers._tokens.delete = function(data, callback) {
    // Check the id is valid
    const id = typeof(data.queryStringObject.id) === 'string' && data.queryStringObject.id.trim().length > 0 ? data.queryStringObject.id.trim() : false;
    if (id) {
        // Lookup the token
        _data.read('tokens', id, function(err, data) {
            if (!err && data) {
                _data.delete('tokens', id, function(err) {
                    if (!err) {
                        callback(200);
                    } else {
                        callback(500, {'Error' : 'Could not delete the specified token'});
                    }
                })
            } else {
                callback(400, {'Error' : 'Could not find specified token'});
            }
        });
    } else {
        callback(400, {'Error' : 'Missing required field'});
    }
};

// Verify if a given token id is currently valid for a given user
handlers._tokens.verifyToken = function(id, phone, callback) {
    // Lookup the token
    _data.read('tokens', id, function(err, tokenData) {
        if (!err && tokenData) {
            // Check that the token is for the given user and has not expired
            if (tokenData.phone === phone && tokenData.expires > Date.now()) {
                callback(true);
            } else {
                callback(false);
            }
        } else {
            callback(false);
        }
    })
};

// Checks
handlers.checks = function(data, callback) {
    const acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._checks[data.method](data, callback);
    } else {
        callback(405);
    }
};

// Container for all the checks methods
handlers._checks = {};

// Checks - post
// Required data: protocol, url, method, successCodes, timeoutSeconds
// Optional data: none

handlers._checks.post = function(data, callback) {
    // Validate inputs
    const protocol = typeof(data.payload.protocol) === 'string' && ['https', 'http'].indexOf(data.payload.protocol) > -1 ? data.payload.protocol : false;
    const url = typeof(data.payload.url) === 'string' && data.payload.url.trim().length > 0 ? data.payload.url.trim() : false;
    const method = typeof(data.payload.method) === 'string' && ['post', 'get', 'put', 'delete'].indexOf(data.payload.method) > -1 ? data.payload.method : false;
    const successCodes = typeof(data.payload.successCodes) === 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes : false;
    const timeoutSeconds = typeof(data.payload.timeoutSeconds) === 'number' && data.payload.timeoutSeconds % 1 === 0 && data.payload.timeoutSeconds >= 1 && data.payload.timeoutSeconds <= 5 ? data.payload.timeoutSeconds : false;

    if (protocol && url && method && successCodes && timeoutSeconds) {
        // Get the token from the headers
        const token = typeof(data.headers.token) === 'string' ? data.headers.token : false;

        // Lookup the user by reading the token
        _data.read('tokens', token, function(err, tokenData) {
            if (!err && tokenData) {
                const userPhone = tokenData.phone;

                // Lookup the user data
                _data.read('users', userPhone, function(err, userData) {
                    if (!err && userData) {
                        const userChecks = typeof(userData.checks) === 'object' && userData.checks instanceof Array ? userData.checks : [];

                        // Verify that the user has less checks than permitted per user
                        if (userChecks.length < config.maxChecks) {

                            // Verify that the URL given has DNS entries (and therefore can resolve)
                            const parsedUrl = _url.parse(protocol+'://'+url, true);
                            const hostName = typeof(parsedUrl.hostname) === 'string' && parsedUrl.hostname.length > 0 ? parsedUrl.hostname : false;
                            dns.resolve(hostName,function(err,records) {
                                if (!err && records) {

                                    // Create a random id for the check
                                    const checkId = helpers.createRandomString(20);

                                    // Create the check object, and include the user's phone
                                    const checkObject = {
                                        id: checkId,
                                        userPhone,
                                        protocol,
                                        url,
                                        method,
                                        successCodes,
                                        timeoutSeconds,
                                    };

                                    // Save the object
                                    _data.create('checks', checkId, checkObject, function (err) {
                                        if (!err) {
                                            // Add the check id to the user's object
                                            userData.checks = userChecks;
                                            userData.checks.push(checkId);

                                            // Save the new user data
                                            _data.update('users', userPhone, userData, function (err) {
                                                if (!err) {
                                                    // Return the data abouy new check
                                                    callback(200, checkObject);
                                                } else {
                                                    callback(500, {'Error': 'Could not update user with the new check'});
                                                }
                                            })
                                        } else {
                                            callback(500, {'Error': 'Could not create a new check'});
                                        }
                                    });
                                } else {
                                    callback(400, {'Error': 'The hostname of the URL entrered did not resolve to any DNS entries'});
                                }
                            });
                        } else {
                            callback(400, {'Error' : 'The user already has the max number of allowed checks ('+config.maxChecks+')'});
                        }
                    } else {
                        callback(403);
                    }
                })
            } else {
                callback(403);
            }
        })

    } else {
        callback(400, {'Error' : 'Missing required inputs or inputs invalid'});
    }
};

// Checks - get
// Required data: id
// Optional data: none
handlers._checks.get = function(data, callback) {
    // Check that the id is valid
    const id = typeof(data.queryStringObject.id) === 'string' && data.queryStringObject.id.trim().length === 20 ? data.queryStringObject.id.trim() : false;
    if (id) {
        // Lookup the check
        _data.read('checks', id, function(err, checkData) {
            if (!err && checkData) {
                // Get the token from the headers
                const token = typeof(data.headers.token) === 'string' ? data.headers.token : false;

                // Verify that the token from headers is valid and belongs to user who created check
                handlers._tokens.verifyToken(token, checkData.userPhone, function(tokenIsValid) {
                    if (tokenIsValid) {
                        // Return the check data
                        callback(200, checkData);
                    } else {
                        callback(403)
                    }
                });
            } else {
                callback(404);
            }
        })
    } else {
        callback(400, {'Error' : 'Missing required field'});
    }
};

// Checks - put
// Required data: id
// Optional data: protocol, url, method, successCodes, timeoutSeconds - one must be send
handlers._checks.put = function(data, callback) {
    // Check for the required field
    const id = typeof(data.payload.id) === 'string' && data.payload.id.trim().length === 20 ? data.payload.id.trim() : false;

    // Check for the optional fields
    const protocol = typeof(data.payload.protocol) === 'string' && ['https', 'http'].indexOf(data.payload.protocol) > -1 ? data.payload.protocol : false;
    const url = typeof(data.payload.url) === 'string' && data.payload.url.trim().length > 0 ? data.payload.url.trim() : false;
    const method = typeof(data.payload.method) === 'string' && ['post', 'get', 'put', 'delete'].indexOf(data.payload.method) > -1 ? data.payload.method : false;
    const successCodes = typeof(data.payload.successCodes) === 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes : false;
    const timeoutSeconds = typeof(data.payload.timeoutSeconds) === 'number' && data.payload.timeoutSeconds % 1 === 0 && data.payload.timeoutSeconds >= 1 && data.payload.timeoutSeconds <= 5 ? data.payload.timeoutSeconds : false;

    // Check to make sure id is valid
    if (id) {
        // Check to make sure one or more optional fields has been sent
        if (protocol || url || method || successCodes || timeoutSeconds) {
            // Lookup the check
            _data.read('checks', id, function(err, checkData) {
                if (!err && checkData) {
                    // Get the token from the headers
                    const token = typeof(data.headers.token) === 'string' ? data.headers.token : false;

                    // Verify that the token from headers is valid and belongs to user who created check
                    handlers._tokens.verifyToken(token, checkData.userPhone, function(tokenIsValid) {
                        if (tokenIsValid) {
                            // Update the check where necessary
                            if (protocol) {
                                checkData.protocol = protocol;
                            }
                            if (url) {
                                checkData.url = url;
                            }
                            if (method) {
                                checkData.method = method;
                            }
                            if (successCodes) {
                                checkData.successCodes = successCodes;
                            }
                            if (timeoutSeconds) {
                                checkData.timeoutSeconds = timeoutSeconds;
                            }

                            // Store the new updates
                            _data.update('checks', id, checkData, function(err) {
                                if (!err) {
                                    callback(200);
                                } else {
                                    callback(500, {'Error' : 'Could not update the check'});
                                }
                            })
                        } else {
                            callback(403);
                        }
                    });
                } else {
                    callback(400, {'Error' : 'Check id did not exist'});
                }
            })
        } else {
            callback(400, {'Error' : 'Missing fields to update'});
        }
    } else {
        callback(400, {'Error' : 'Missing required field'});
    }

};

// Checks - delete
// Required data: id
// Optional data: none
handlers._checks.delete = function(data, callback) {
    // Check if the id is valid
    const id = typeof(data.queryStringObject.id) === 'string' && data.queryStringObject.id.trim().length === 20 ? data.queryStringObject.id.trim() : false;
    if (id) {
        // Lookup the check
        _data.read('checks', id, function(err, checkData) {
            if (!err && checkData) {
                // Get the token from the headers
                const token = typeof(data.headers.token) === 'string' ? data.headers.token : false;

                // Verify that the token from headers is valid for the phone number
                handlers._tokens.verifyToken(token, checkData.userPhone, function(tokenIsValid) {
                    if (tokenIsValid) {
                        // Delete the check data
                        _data.delete('checks', id, function(err) {
                            if (!err) {
                                // Lookup the user
                                _data.read('users', checkData.userPhone, function (err, userData) {
                                    if (!err && userData) {
                                        const userChecks = typeof(userData.checks) === 'object' && userData.checks instanceof Array ? userData.checks : [];

                                        // Remove the delete check from their list of checks
                                        const checkPosition = userChecks.indexOf(id);
                                        if (checkPosition > -1) {
                                            userChecks.splice(checkPosition, 1);

                                            // Re-save the users data
                                            _data.update('users', checkData.userPhone, userData, function (err) {
                                                if (!err) {
                                                    callback(200);
                                                } else {
                                                    callback(500, {'Error': 'Could not update the user'});
                                                }
                                            });
                                        } else {
                                            callback(500, {'Error' : 'Could not find the check on the users object'});
                                        }
                                    } else {
                                        callback(500, {'Error': 'Could not find user who created the check'});
                                    }
                                });
                            } else {
                                callback(500, {'Error' : 'Could not delete check data'});
                            }
                        });
                    } else {
                        callback(403);
                    }
                });
            } else {
                callback(400, {'Error' : 'The specified check ID does not exist'});
            }
        });
    } else {
        callback(400, {'Error' : 'Missing required field'});
    }

};




// Ping handler
handlers.ping = function(data, callback) {
    callback(200);
};

// Not found handler
handlers.notFound = function(data, callback) {
    callback(404);
};

// Export the modul
module.exports = handlers;
