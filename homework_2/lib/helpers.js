/*
 * Helpers for various tasks
 *
 */

// Dependencies
const crypto = require('crypto');
const config = require('./config');
const fs = require('fs');
const path = require('path');
const https = require('https');
const querystring = require('querystring');

// Container for all the helpers
const helpers = {};

// Create a SHA256 hash
helpers.hash = function(str) {
  if (typeof(str) === 'string' && str.length > 0) {
      return crypto.createHmac('sha256', config.env.hashingSecret).update(str).digest('hex');
  } else {
      return false;
  }
};

// Parse a JSON string to an object in all cases without throwing (Node natively throws an error, we don't want it)
helpers.parseJsonToObject = function(str) {
    try {
        return JSON.parse(str);
    } catch(err) {
        return {};
    }
};

// Create a string of random alphanumeric characters, of a given length
helpers.createRandomString = function(strLength) {
    const length = typeof(strLength) === 'number' && strLength > 0 ? strLength : false;
    if (length) {
        // Define all the possible characters that could go into a string
        const possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';

        // Start the final string
        let str = '';
        for (let i = 0 ; i < length ; i++) {
            // Get random character from the possible characters
            const randomChar = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
            // Append this character to the final string
            str += randomChar;
        }

        // Return the final string
        return str;
    } else {
        return false;
    }
};

// Validate email input
helpers.validateEmail = function(input) {
    const trimmedInput = typeof(input) === 'string' ? input.trim() : false;
    const emailRegex = /(?:"?([^"]*)"?\s)?(?:<?(.+@[^>]+)>?)/;

    if (trimmedInput && emailRegex.test(String(trimmedInput).toLowerCase())){
        return trimmedInput;
    } else {
        return false;
    }
};

//Get menu in JSON format
helpers.getMenu = function() {
    const menu = fs.readFileSync(path.join(__dirname, 'menu.json'), 'utf8');

    return JSON.parse(menu);
};

// Validate cart request
helpers.validateCartRequest = function(array) {
    // Check if argument is array
    let verifiedArray = typeof(array) == 'object' && array instanceof Array && array.length > 0 ? array : false;

    if (!verifiedArray) {
        return false
    }

    // Check if every array item has id and amount fields
    if (!verifiedArray.every((item) => {
        return ['id', 'amount'].every((requiredField) => item.hasOwnProperty(requiredField))
        })
    ) {
        return false
    }

    //TODO Validate ids and amounts values
    return verifiedArray
};

// Generate file name for user cart
helpers.getCartFileName = function(cartId, email) {
    return `cart_${cartId}_of_${email}`;
};

// Process purchase
helpers.processPurchase = function (receiverEmail, order, callback) {
    const email = config.env.testMode ? config.env.testEmail : receiverEmail;
    const bill = helpers.calculateReceipt(order);
    const purchasePayload = helpers.createPurchasePayload(bill, email);
    const purchaseDetails = helpers.createStripeRequest(purchasePayload);

    helpers.purchase(purchaseDetails, purchasePayload, function (err) {
        if (err) {
            callback(true);
        } else {
            callback(false);

            // If the payment was accepted, send the receipt via email
            const sender = config.env.mailgun.senderMail;

            helpers.sendReceipt(sender, email, "Pizza receipt", bill.desc, function (err) {
                if (err) {
                    console.log('Error while sending receipt: ' + err);
                } else {
                    console.log('Receipt has been sent to: ' + email);
                }
            });
        }
    });
};

// Submit purchase
helpers.purchase = function (purchaseDetails, purchasePayload, callback) {
    if (purchaseDetails && purchasePayload) {
        const req = https.request(purchaseDetails, function (res) {
            if (200 === res.statusCode || 201 === res.statusCode) {
                callback(false);
            } else {
                callback({'Error' : 'Payment problems 1'});
            }
        });
        req.on('error', function (error) {
            callback({'Error' : 'Payment problems 2'});
        });

        req.write(purchasePayload);
        req.end();
    } else {
        callback('Missing required field or field invalid.');
    }
};

// Send receipt via email
helpers.sendReceipt = function (sender, receiver, subject, message, callback) {
    const senderEmail = helpers.validateEmail(sender);
    const receiverEmail = helpers.validateEmail(receiver);
    const messageSubject = typeof(subject) === 'string' && subject.trim().length > 0 ? subject.trim() : false;
    const messageContent = typeof(message) === 'string' && message.trim().length > 0 ? message.trim() : false;

    if (senderEmail && receiverEmail && messageSubject && messageContent) {

        // Create request payload
        const payload = {
            from: senderEmail,
            to: receiverEmail,
            subject: messageSubject,
            text: messageContent,
        };
        const stringPayload = querystring.stringify(payload);

        // Configure the request details
        const requestDetails = {
            protocol: 'https:',
            hostname: config.env.mailgun.hostname,
            method: 'post',
            path: `/v2/${config.env.mailgun.domain}/messages`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(stringPayload),
                'Authorization': 'Basic ' + Buffer.from('api:' + config.env.mailgun.apiKey, 'utf8').toString('base64')
            },
        };

        // Instantiate the request object
        var req = https.request(requestDetails, function (res) {

            res.on('data', function (data) {
                console.log("\nData from MailGun:\n" + data + "\n");
            });

            res.on('end', function () {
                const status = res.statusCode;
                if (status === 200 || status === 201) {
                    callback(false);
                } else {
                    callback('Status code returned: ' + status, JSON.stringify(res.headers));
                }
            });
        });

        req.on('error', function (error) {
            callback(error);
        });

        req.write(stringPayload);
        req.end();

    } else {
        callback(`Error: Missing required field. Input data:\nSender: ${sender}\nReceiver: ${receiver}\nSubject: ${subject}\nContent: ${message}\n`);
    }
};

// Calculate receipt
helpers.calculateReceipt = function (order) {
    const menu = helpers.getMenu();
    let bill = 0;
    let desc = 'Your pizzas are coming';

    order.forEach((item) => {
        const pizza = menu.find((pizza) => pizza.id === item.id);
        if (pizza !== undefined) {
            bill += item.amount * pizza.price;
        }
    });

    desc += `\nTOTAL: ${bill.toFixed(2)} $`;

    return {
        charge: (bill).toFixed(0),
        desc,
    };
};

// Purchase payload
helpers.createPurchasePayload = function (bill, email) {
    const payload = {
        currency: 'usd',
        source: 'tok_mastercard',
        amount: bill.charge,
    };
    return querystring.stringify(payload);
};

// Stripe request
helpers.createStripeRequest = function (content) {
    return requestDetails = {
        protocol: 'https:',
        hostname: 'api.stripe.com',
        method: 'POST',
        auth: 'sk_test_4eC39HqLyjWDarjtT1zdp7dc',
        path: '/v1/charges',
        headers:
            {
                'Content-Length': Buffer.byteLength(content),
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
    };
};

// Export the module
module.exports = helpers;
