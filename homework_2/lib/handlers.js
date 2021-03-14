/*
 * Request handlers
 *
 */

// Dependencies
const _data = require('./data');
const helpers = require('./helpers');
const config = require('./config');

// Define the handlers
const handlers = {};

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
// Required data (payload): firstName, lastName, email, password, address, streetAddress
// Optional data: none
handlers._users.post = function(data, callback) {
    // Check that all required fields are filled out
    const firstName = typeof(data.payload.firstName) === 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    const lastName = typeof(data.payload.lastName) === 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    const email = helpers.validateEmail(data.payload.email);
    const password = typeof(data.payload.password) === 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    const address = typeof(data.payload.address) === 'string' && data.payload.address.trim().length > 0 ? data.payload.address.trim() : false;
    const streetAddress = typeof(data.payload.streetAddress) === 'string' && data.payload.streetAddress.trim().length > 0 ? data.payload.streetAddress.trim() : false;

    if (firstName && lastName && email && password && address && streetAddress) {
        // Make sure that the user doesn't already exist, user email used as unique identifier
        _data.read('users', email, function(err, data) {
            if (err) {
                // Hash the password
                const hashedPassword = helpers.hash(password);

                // Create the user object
                if (hashedPassword) {
                    const userObject = {
                        firstName,
                        lastName,
                        email,
                        hashedPassword,
                        address,
                        streetAddress,
                    };

                    // Store the user
                    _data.create('users', email, userObject, function(err) {
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
                callback(400, {'Error' : 'A user with that email already exists'});
            }
        });
    } else {
        callback(400, {'Error' : 'Missing required fields tralala'});
    }
};

// Users - get
// Required data (payload): email
// Optional data: none
handlers._users.get = function(data, callback) {
    // Check that email is valid
    const email = helpers.validateEmail(data.payload.email);
    if (email) {
        // Get the token from the headers
        const token = typeof(data.headers.token) === 'string' ? data.headers.token : false;

        // Verify that the token from headers is valid for the email
        handlers._tokens.verifyToken(token, email, function(tokenIsValid) {
            if (tokenIsValid) {
                // Lookup the user
                _data.read('users', email, function(err, data) {
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
        callback(400, {'Error' : 'Missing required field (email)'});
    }

};

// Users - put
// Required data (payload): email
// Optional data (payload): firstName, lastName, password, address, streetAddress - at least one must be specified
handlers._users.put= function(data, callback) {
    // Check for the required field
    const email = helpers.validateEmail(data.payload.email);

    // Check for the optional fields
    const firstName = typeof(data.payload.firstName) === 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    const lastName = typeof(data.payload.lastName) === 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    const password = typeof(data.payload.password) === 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    const address = typeof(data.payload.address) === 'string' && data.payload.address.trim().length > 0 ? data.payload.address.trim() : false;
    const streetAddress = typeof(data.payload.streetAddress) === 'string' && data.payload.streetAddress.trim().length > 0 ? data.payload.streetAddress.trim() : false;

    // Error if the email is invalid
    if (email) {
        // Error if nothing is sent to update
        if (firstName || lastName || password || address || streetAddress) {
            // Get the token from the headers
            const token = typeof(data.headers.token) === 'string' ? data.headers.token : false;

            // Verify that the token from headers is valid for the email
            handlers._tokens.verifyToken(token, email, function(tokenIsValid) {
                if (tokenIsValid) {
                    // Lookup the user
                    _data.read('users', email, function (err, userData) {
                        if (!err && userData) {
                            // Update the fields as necessary
                            if (firstName) {
                                userData.firstName = firstName;
                            }
                            if (lastName) {
                                userData.lastName = lasttName;
                            }
                            if (password) {
                                userData.hashedPassword = helpers.hash(password);
                            }
                            if (address) {
                                userData.address = address;
                            }
                            if (streetAddress) {
                                userData.streetAddress = streetAddress;
                            }
                            // Store the new updates
                            _data.update('users', email, userData, function (err) {
                                if (!err) {
                                    callback(200);
                                } else {
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
// Required field (payload): email
handlers._users.delete = function(data, callback) {
    // Check the email is valid
    const email = helpers.validateEmail(data.payload.email);

    if (email) {
        // Get the token from the headers
        const token = typeof(data.headers.token) === 'string' ? data.headers.token : false;

        // Verify that the token from headers is valid for the email
        handlers._tokens.verifyToken(token, email, function(tokenIsValid) {
            if (tokenIsValid) {
                // Lookup the user
                _data.read('users', email, function (err, userData) {
                    if (!err && userData) {
                        _data.delete('users', email, function (err) {
                            if (!err) {
                                _data.listContaining('carts', email, function (err, fileList) {
                                    if (!err) {
                                        fileList.forEach(function (fileName) {
                                            _data.delete('carts', fileName, function (err) {
                                                if (err) {
                                                    console.log('\nError deleting cart: ' + email + '\n');
                                                }
                                            });
                                        });
                                    } else {
                                        callback(500, {'Error': 'Error deleting users files'});
                                    }
                                });
                                callback(200);
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
// Required data: email, password
// Optional data: none
handlers._tokens.post = function(data, callback) {
    const email = helpers.validateEmail(data.payload.email);
    const password = typeof(data.payload.password) === 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    if (email && password) {
        // Lookup the user who matches that email
        _data.read('users', email, function(err, userData) {
            if (!err) {
                // Hash the sent password and compare it to the password stored in the user object
                const hashedPassword = helpers.hash(password);
                if (hashedPassword === userData.hashedPassword) {
                    // If valid create a new token with a random name and expiration date 1 hour into the future
                    const tokenId = helpers.createRandomString(20);
                    const expires = Date.now() + 1000 * 240 * 60;
                    const tokenObject = {
                        email,
                        id: tokenId,
                        expires,
                    };

                    // Store the token
                    _data.create('tokens', tokenId, tokenObject, function(err) {
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
handlers._tokens.verifyToken = function(id, email, callback) {
    // Lookup the token
    _data.read('tokens', id, function(err, tokenData) {
        if (!err && tokenData) {
            // Check that the token is for the given user and has not expired
            if (tokenData.email === email && tokenData.expires > Date.now()) {
                callback(true, tokenData);
            } else {
                callback(false);
            }
        } else {
            callback(false);
        }
    })
};

// Verify if a given token id is still valid
handlers._tokens.verifyTokenSession = function(id, callback) {
    // Lookup the token
    _data.read('tokens', id, function(err, tokenData) {
        if (!err && tokenData) {
            // Check that the token has not expired
            if (tokenData.expires > Date.now()) {
                callback(true, tokenData);
            } else {
                callback(false);
            }
        } else {
            callback(false);
        }
    })
};

// Menu
handlers.menu = function(data, callback) {
    const acceptableMethods = ['get'];

    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._menu[data.method](data, callback);
    } else {
        callback(405);
    }
};

// Container for the menu methods
handlers._menu = {};

// Menu - get
// Required data: none
// Optional data: none

handlers._menu.get = function(data, callback){
    // Verify that the token is valid for the email
    handlers._tokens.verifyTokenSession(data.headers.token, function(tokenIsValid) {

        if (tokenIsValid) {
            callback(200, helpers.getMenu());
        } else {
            callback(403, {'Error' : 'Missing required token or token invalid'});
        }
    });
};

// Cart
handlers.cart = function(data, callback) {
    const acceptableMethods = ['post', 'get', 'delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._cart[data.method](data, callback);
    } else {
        callback(405);
    }
};

// Container for the cart methods
handlers._cart = {};

// Cart - post
// Required data: token, array of pizza objects (id + amount)
// Optional data: none
handlers._cart.post = function(data, callback) {
    // Verify that the given token is valid
    handlers._tokens.verifyTokenSession(data.headers.token, function(tokenIsValid, tokenData) {
        if (tokenIsValid && tokenData) {
            // Validate cart request
            const cart = helpers.validateCartRequest(data.payload);

            if (!cart) {
                callback(403, {'Error' : 'Invalid cart request' });
                return;
            }

            const cartId = Date.now();
            const cartFileName = helpers.getCartFileName(cartId, tokenData.email);
            const cartData =  {cartId, items: cart };

            _data.create('carts', cartFileName, cartData, function(err) {
                if (err) {
                    callback(500, {'Error' : 'Error adding pizzas to cart'});
                } else {
                    callback(200, {'Order received for cart id': cartId});
                }
            });
        } else {
            callback(403, {'Error': 'Missing required token in header, or token invalid'})
        }
    });
};

// Cart - get
// Required data: token
// Optional data: none
handlers._cart.get = function(data, callback) {

    // Verify that the given token is valid
    handlers._tokens.verifyTokenSession(data.headers.token, function(tokenIsValid, tokenData) {
        if (!tokenIsValid) {
            callback(403, {'Error' : 'Invalid token'});
        } else {
            // List all items in the directory containing the userEmail
            _data.listContaining('carts', tokenData.email, function(err, fileList) {

                if (err) {
                    callback(500, {'Error' :  'Cart error' });
                }
                else {
                    if (fileList.length === 0) {
                        callback(200, {'Cart': 'No carts found'});
                    }
                    const cartArray = [];
                    let count = 0;

                    fileList.forEach(function(fileName) {
                        _data.read('carts', fileName, function(err, cartData) {
                            ++count;
                            if (err) {
                                callback(500, {'Error' :  'Cart error' });
                                return;
                            }
                            else if (cartData !== null){
                                cartArray.push(cartData);
                            }
                            if (count === fileList.length) {
                                callback(200, {'Cart': cartArray});
                            }
                        });
                    });
                }
            });
        }
    })
};

// Cart - delete
// Required data: token, cartId
// Optional data: none
handlers._cart.delete = function(data, callback) {

    // Verify that the given token is valid
    handlers._tokens.verifyTokenSession(data.headers.token, function(tokenIsValid, tokenData) {
        if (tokenIsValid && tokenData) {
            const cartId = data.queryStringObject.cartId;

            if (!cartId) {
                callback(403, {'Error' : 'Cart id is missing or invalid' });
            }

            const cartFileName = helpers.getCartFileName(cartId, tokenData.email);
            _data.delete('carts', cartFileName, function(err) {
                if (err) {
                    callback(500, {'Error' : 'Error deleting cart or cart does not exist.'});
                } else {
                    callback(200);
                }
            });
        } else {
            callback(403, {'Error' : 'Invalid token' });
        }
    });
};

// Purchase
handlers.purchase = function(data, callback) {
    const acceptableMethods = ['post'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._purchase[data.method](data, callback);
    } else {
        callback(405);
    }
};

// Container for the cart methods
handlers._purchase = {};

// Purchase - post
// Required data: cartId that exists
// Optional data: none
handlers._purchase.post = function (data, callback) {
    handlers._tokens.verifyTokenSession(data.headers.token, function (tokenIsValid, tokenData) {
        if (tokenIsValid && tokenData) {
            const cartId = data.headers.cartid;

            if (!cartId) {
                callback(500, { 'Error': 'Valid cartId has to be sent in header' });
                return;
            }

            const cartFileName = helpers.getCartFileName(cartId, tokenData.email);

            // Lookup the user by reading the token
            _data.read('tokens', data.headers.token, function(err, tokenData) {
                if (!err && tokenData) {
                    getPurchaseFromCartId({cartId, cartFileName}).then(function (purchaseData) {
                        helpers.processPurchase(tokenData.email, purchaseData, function (err) {
                            if (err) {
                                callback(400, {'Error': 'Payment error'});
                            } else {
                                // Delete cart file when purchase is successful
                                if (cartId) {
                                    _data.delete('carts', cartFileName, function (err) {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            console.log(`Cart was deleted`);
                                        }
                                    });
                                }
                                callback(200);
                            }
                        });
                    })
                        .catch(function (error) {
                            callback(500, {'Error': error});
                        });
                } else {
                    callback(403);
                }
            });
        } else {
            callback(403, { 'Error': 'Token invalid' });
        }
    });
};

// Get purchase order from cartId
const getPurchaseFromCartId = function(data) {
    return new Promise(function(resolve, reject) {
        const cartFileName = data.cartFileName;

        _data.read('carts', cartFileName, function(err, cartData) {
            if (err || cartData === null) {
                reject('Error reading the cart');
            } else {
                purchaseData = helpers.validateCartRequest(cartData.items);
                if (purchaseData) {
                    resolve(purchaseData);
                } else {
                    reject('Error reading the cart. Try again later');
                }
            }
        });
    });
};

// Not found handler
handlers.notFound = function(data, callback) {
    callback(404);
};

// Export the module
module.exports = handlers;
