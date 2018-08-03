import { truncate } from 'fs';
import _data from './data'
import helpers from '../helpers'

// Define the handlers
let handlers = {}

// Users
handlers.users = (data, callback) => {
    let acceptableMethods = ['post', 'get', 'put', 'delete']
    if(acceptableMethods.indexOf(data.method) > -1) {
        handlers._users[data.method](data, callback)
    }
    else {
        callback(405)
    }
}

// Container for the users submethods
handlers._users = {}

// Users - post
// Required data: firstName, lastName, phone, password, tosAgreement
// Optional data: none
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

// Users - get
// Required data: phone
// Optional data : none
handlers._users.get = (data, callback) => {
    // Check thet the phone number is valid
    const phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 
        ? data.queryStringObject.phone.trim()
        : false
    
    if(phone) {
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
        callback(400, {'Error' : 'Missing required field'})
    }
}

// Users - put
handlers._users.put = (data, callback) => {

}

// Users - delete
handlers._users.delete = (data, callback) => {

}

export default handlers