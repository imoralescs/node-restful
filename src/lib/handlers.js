import { truncate } from "fs";

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
            // Hash password
            const hashedPassword = helpers.hash(password)
        })
    }
    else {
        callback(400, {'Error' : 'A user with that phone number already exists'})
    }
}

// Users - get
handlers._users.get = (data, callback) => {

}

// Users - put
handlers._users.put = (data, callback) => {

}

// Users - delete
handlers._users.delete = (data, callback) => {

}

export default handlers