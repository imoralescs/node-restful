import { truncate } from 'fs';
import _data from './data'
import helpers from '../helpers'

/*
 * Define the handlers
 */
let handlers = {}

/*
 * Users service handlers
 */
handlers.users = (data, callback) => {
    let acceptableMethods = ['post', 'get', 'put', 'delete']
    if(acceptableMethods.indexOf(data.method) > -1) {
        handlers._users[data.method](data, callback)
    }
    else {
        callback(405)
    }
}

/*
 * Container for the users handler submethods
 */
handlers._users = {}

// @route POST /users
// @description Create users
// @required firstName, lastName, phone, password, tosAgreement
// @optional none
// @access public
handlers._users.post = (data, callback) => {
    // Check that all required fields are filled out
    let 
        firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0
            ? data.payload.firstName.trim()
            : false,
        lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0
            ? data.payload.lastName.trim()
            : false,
        phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10
            ? data.payload.phone.trim()
            : false,
        password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 
            ? data.payload.password.trim()
            : false,
        tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true 
            ? true 
            : false;
    
    if(firstName && lastName && phone && password && tosAgreement) {
        // Make sure the user doest already exist
        _data.read('users', phone, (err, data) => {
            if(err) {
                // Hash password
                const hashedPassword = helpers.hash(password)
                console.log(hashedPassword)

                // Create the user object
                const userObject = {
                    'firstName' : firstName,
                    'lastName' : lastName,
                    'phone' : phone,
                    'hashedPassword' : hashedPassword,
                    'tosAgreement' : true
                }

                // Store the user
                _data.create('users', phone, userObject, (err) => {
                    if(!err) {
                        callback(200)
                    }
                    else {
                        console.log(err)
                        callback(500, {'Error' : 'Could not create the new user'})
                    }
                })

            }
            else {
                callback(400, {'Error' : 'A user with that phone number already exists'})
            }
        })
    }
    else {
        callback(400, {'Error' : 'Missing required fields'})
    }
}

// @route GET /users?phone=:number
// @description Get users by user phone
// @required phone
// @optional none
// @access private
handlers._users.get = (data, callback) => {
    // Check thet the phone number is valid
    const phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 
        ? data.queryStringObject.phone.trim()
        : false
    
    if(phone) {
        // Get the token from the headers
        const token = typeof(data.headers.token) == 'string'
        ? data.headers.token
        :false

        // Verify that given token is valid for the phone number
        handlers._tokens.verifyToken(token, phone, (tokenIsValid) => {
            if(tokenIsValid) {
                // Lookup the user
                _data.read('users', phone, (err, data) => {
                    if(!err && data) {
                        // Remove the hashed password from the user object before returning it to the req
                        delete data.hashedPassword
                        callback(200, data)
                    }
                    else {
                        callback(404)
                    }
                })
            }
            else {
                callback(403, {'Error' : 'Missing required token in header, or token is invalid'})
            }
        })
    }
    else {
        callback(400, {'Error' : 'Missing required field'})
    }
}

// @route PUT /users?phone=:number
// @description Update users by user phone
// @required phone
// @optional firstName, lastName, password
// @access private
handlers._users.put = (data, callback) => {
    // Check thet the phone number is valid
    const phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 
        ? data.payload.phone.trim()
        : false

    // Check for the required field
    let 
        firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0
            ? data.payload.firstName.trim()
            : false,
        lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0
            ? data.payload.lastName.trim()
            : false,
        password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 
            ? data.payload.password.trim()
            : false;
        
    // Error if nothing is sent to update
    if(phone) {
        // Error if nothing is sent to update
        if(firstName || lastName || password) {


            // Get the token from the headers
            const token = typeof(data.headers.token) == 'string'
            ? data.headers.token
            :false

            // Verify that given token is valid for the phone number
            handlers._tokens.verifyToken(token, phone, (tokenIsValid) => {
                if(tokenIsValid) {
                    // Lookup the user
                    _data.read('users', phone, (err, userData) => {
                        if(!err && userData) {
                            // Update the fields necesarry
                            if(firstName) {
                                userData.firstName = firstName
                            }

                            if(lastName) {
                                userData.lastName = lastName
                            }

                            if(password) {
                                userData.hashedPassword = helpers.hash(password)
                            }

                            // Store the new updates
                            _data.update('users', phone, userData, (err) => {
                                if(!err) {
                                    callback(200)
                                }
                                else {
                                    callback(500, {'Error' : 'Could not update the user'})
                                }
                            })
                        }
                        else {
                            callback(400, {'Error' : 'The specified user does not exist'})
                        }
                    })
                }
                else {
                    callback(403, {'Error' : 'Missing required token in header, or token is invalid'})
                }
            })
        }
        else {
            callback(400, {'Error' : 'Missing fields to update'})
        }
    }
    else {
        callback(400, {'Error' : 'Missing required field'})
    }
}

// @route DELETE /users?phone=:number
// @description Delete users by user phone
// @required phone
// @optional none
// @access private
handlers._users.delete = (data, callback) => {
    // Check thet the phone number is valid
    const phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 
        ? data.queryStringObject.phone.trim()
        : false
    
    if(phone) {

        // Get the token from the headers
        const token = typeof(data.headers.token) == 'string'
        ? data.headers.token
        :false

        // Verify that given token is valid for the phone number
        handlers._tokens.verifyToken(token, phone, (tokenIsValid) => {
            if(tokenIsValid) {
                // Lookup the user
                _data.read('users', phone, (err, data) => {
                    if(!err && data) {
                        _data.delete('users', phone, (err) => {
                            if(!err) {
                                callback(200)
                            }
                            else {
                                callback(500, {'Error' : 'Could not delete the specified user'})
                            }
                        })
                    }
                    else {
                        callback(404, {'Error' : 'Could not find the specified user'})
                    }
                })
            }
            else {
                callback(403, {'Error' : 'Missing required token in header, or token is invalid'})
            }
        })
    }
    else {
        callback(400, {'Error' : 'Missing required field'})
    }
}

/*
 * Token service handlers
 */
handlers.tokens = (data, callback) => {
    let acceptableMethods = ['post', 'get', 'put', 'delete']
    if(acceptableMethods.indexOf(data.method) > -1) {
        handlers._tokens[data.method](data, callback)
    }
    else {
        callback(405)
    }
}

/*
 * Container for the users handler submethods
 */
handlers._tokens = {}

// @route POST /tokens
// @description Create token
// @required phone, password
// @optional none
// @access public
handlers._tokens.post = (data, callback) => {
    let
        phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10
            ? data.payload.phone.trim()
            : false,
        password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 
            ? data.payload.password.trim()
            : false
    
    if(phone && password) {
        // Lookup the user who matches that phone number
        _data.read('users', phone, (err, userData) => {
            if(!err && userData) {
                // Hash the sent password and compare it to the password stored in the user object
                const hashedPassword = helpers.hash(password)
                if(hashedPassword == userData.hashedPassword) {
                    // If valid, create a new token with a ramdom name and set expiration data 1 hour
                    const tokenId = helpers.createRandomString(20)
                    const expires = Date.now() + 1000 * 60 * 60
                    const tokenObject = {
                        'phone' : phone,
                        'id' : tokenId,
                        'expires' : expires
                    }

                    // Store the token
                    _data.create('tokens', tokenId, tokenObject, (err) => {
                        if(!err) {
                            callback(200, tokenObject)
                        }
                        else {
                            callback(500, {'Error' : 'Could not create the new token'})
                        }
                    })
                }
                else {
                    callback(400, {'Error' : 'Password did not match the specified user\'s stored password'})
                }
            }
            else {
                callback(400, {'Error' : 'Could not find the specified user'})
            }
        })
    }
    else {
        callback(400, {'Error' : 'Missing required field(s)'})
    } 
}

// @route GET /tokens?id=:token
// @description Access to private route
// @required token
// @optional none
// @access private
handlers._tokens.get = (data, callback) => {
    // Check thet the id is valid
    const id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 
        ? data.queryStringObject.id.trim()
        : false
    
    if(id) {
        // Lookup the user
        _data.read('tokens', id, (err, tokenData) => {
            if(!err && tokenData) {
                callback(200, tokenData)
            }
            else {
                callback(404)
            }
        })
    }
    else {
        callback(400, {'Error' : 'Missing required field'})
    }    
}

// @route PUT /tokens
// @description Extend token expiration time
// @required id, extand
// @optional none
// @access private
handlers._tokens.put = (data, callback) => {
    let
        id = typeof(data.payload.id) == 'string' && data.payload.id.trim().length == 20
            ? data.payload.id.trim()
            : false,
        extend = typeof(data.payload.extend) == 'boolean' && data.payload.extend == true
            ? true
            : false

    if(id && extend) {
        // Lookup the token
        _data.read('tokens', id, (err, tokenData) => {
            if(!err && tokenData) {
                // Check to the make sure the token isn't already expired
                if(tokenData.expires > Date.now()) {
                    // Set the expiration an hour from now
                    tokenData.expires = Date.now() + 1000 * 60 * 60

                    // Store the new updates
                    _data.update('tokens', id, tokenData, (err) => {
                        console.log(err)
                        if(!err) {
                            callback(200)
                        }
                        else {
                            callback(500, {'Error' : ' Could not update the toke\'s expiration'})
                        }
                    })
                }
                else {
                    callback(400, {'Error' : 'The token has already expired, and cannot be extended'})
                }
            }
            else {
                callback(400, {'Error' : 'Specified token does not exist'})
            }
        })
    }
    else {
        callback(400, {'Error' : 'Missing required field(s) or field(s) are invalid'})
    }
}

// @route DELETE /tokens?id=:token
// @description Delete token
// @required token
// @optional none
// @access private
handlers._tokens.delete = (data, callback) => {
    // Check Lookup the token
    const id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 
        ? data.queryStringObject.id.trim()
        : false
    
    if(id) {
        // Lookup the token
        _data.read('tokens', id, (err, data) => {
            if(!err && data) {
                _data.delete('tokens', id, (err) => {
                    if(!err) {
                        callback(200)
                    }
                    else {
                        callback(500, {'Error' : 'Could not delete the specified token'})
                    }
                })
            }
            else {
                callback(400, {'Error' : 'Could not find the specified token'})
            }
        })
    }
    else {
        callback(400, {'Error' : 'Missing required field'})
    }
}

/*
 * Verify if a given token id is currently valid for a given user
 */
handlers._tokens.verifyToken = (id, phone, callback) => {
    // Lookup the token
    _data.read('tokens', id, (err, tokenData) => {

        if(!err && tokenData) {
            // Check that the token is for the given user and has not expired
            if(tokenData.phone == phone && tokenData.expires > Date.now()) {
                callback(true)
            }
            else {
                callback(false)
            }
        }
        else {
            callback(false)
        }
    })
}

/*
 * Ping service handlers
 */
handlers.ping = (data, callback) => (callback(200))

/*
 * Not found service handlers
 */
handlers.notFound = (data, callback) => (callback(400))

export default handlers