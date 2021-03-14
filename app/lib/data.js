/*
 * Library for storing and editing data
 *
 */

// Dependencies
const fs = require('fs');
const path = require('path');
const helpers = require('./helpers');

//Container for the module (to be exported)
const lib = {};

// Base directory of the data folder
lib.baseDir = path.join(__dirname,'/../.data/');

// Write data to a file
lib.create = function(dir, filename, data, callback) {
    // Open file for writing
    fs.open(lib.baseDir+dir+'/'+filename+'.json', 'wx', function(err, fileDescriptor) {
        if (!err && fileDescriptor) {
            // Convert data to string (as JSON will be thrown here)
            const stringData = JSON.stringify(data);

            // Write to file and close it
            fs.writeFile(fileDescriptor, stringData, function(err) {
                if (!err) {
                    fs.close(fileDescriptor, function(err) {
                        if (!err) {
                            callback(false);
                        } else {
                            callback('Error closing new file');
                        }
                    });
                } else {
                    callback('Error writing to a new file');
                }
            });
        } else {
            callback('Could not create new file, it may already exist');
        }
    });
};

// Read data from a file
lib.read = function(dir, filename, callback) {
    fs.readFile(lib.baseDir+dir+'/'+filename+'.json','utf8', function(err, data) {
        if (!err && data) {
            const parsedData = helpers.parseJsonToObject(data);
            callback(false, parsedData);
        } else {
            callback(err, data);
        }
    })
};

// Update data inside a file
lib.update = function(dir, filename, data, callback) {
    // Open the file for writing
    fs.open(lib.baseDir+dir+'/'+filename+'.json', 'r+', function(err, fileDescriptor) {
        if (!err && fileDescriptor) {
            // Convert data to string (as JSON will be thrown here)
            const stringData = JSON.stringify(data);

            // Truncate the file
            fs.truncate(fileDescriptor, function(err) {
                if (!err) {
                    // Write to the file and close it
                    fs.writeFile(fileDescriptor, stringData, function(err) {
                        if (!err) {
                            fs.close(fileDescriptor, function(err) {
                                if (!err) {
                                    callback(false);
                                } else {
                                    callback('Error closing file');
                                }
                            });
                        } else {
                            callback('Error writing to existing file');
                        }
                    });

                } else {
                    callback('Error truncating file');
                }
            });
        } else {
            callback('Could not open a file for update, it may not exist yet');
        }
    });
};

// Delete a file
lib.delete = function(dir, filename, callback) {
    // Unlink the file
    fs.unlink(lib.baseDir+dir+'/'+filename+'.json',function(err) {
        if (!err) {
            callback(false);
        } else {
            callback('Error deleting file');
        }
    });
};

// List all the items in a directory
lib.list = function(dir, callback) {
    fs.readdir(lib.baseDir+dir+'/', function(err, data) {
        if (!err && data && data.length > 0) {
            const trimmedFileNames = [];
            data.forEach(function(fileName) {
                trimmedFileNames.push(fileName.replace('.json',''));
            });
            callback(false, trimmedFileNames);
        } else {
            callback(err, data);
        }
    })
};

// Export the module
module.exports = lib;
