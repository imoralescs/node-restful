import url from 'url'

//-- Basic
/*
const server = (req, res) => {
    res.end('Hello World\n')
}
*/

//-- Parsing Request Paths
/*
const server = (req, res) => {
    // Get the URL and parse it
    const 
        parsedUrl = url.parse(req.url, true)

    // Get the path
    const
        path = parsedUrl.pathname,
        trimmedPath = path.replace(/^\/+|\/+$/g,'')
        
    // Send the response
    res.end('Hello Worlds')

    // Log the request path
    console.log('Request received on path: ', trimmedPath)
    // GET - http://localhost:3000/foo
    //-> foo
    // GET - http://localhost:3000/api
    //-> api
}
*/

//-- Parsing HTTP methods
/*
const server = (req, res) => {
    const 
        parsedUrl = url.parse(req.url, true)

    const
        path = parsedUrl.pathname,
        trimmedPath = path.replace(/^\/+|\/+$/g,'')
    
    // Get the HTTP method
    const 
        method = req.method.toLowerCase()

    res.end('Hello Worlds')

    console.log('Request received method: ', method)
    // GET - http://localhost:3000/api
    //-> get
}
*/

//-- Parsing query string
/*
const server = (req, res) => {
    const 
        parsedUrl = url.parse(req.url, true)

    const
        path = parsedUrl.pathname,
        trimmedPath = path.replace(/^\/+|\/+$/g,'')
    
    // Get the query string as an object
    const 
        queryStringObject = parsedUrl.query

    const 
        method = req.method.toLowerCase()

    res.end('Hello Worlds')

    console.log('Request received query string: ', queryStringObject)
    // GET - http://localhost:3000/foo?buzz=fuzz
    //-> { buzz: 'fuzz' }
}
*/

//-- Parsing Headers
/*
const server = (req, res) => {
    const 
        parsedUrl = url.parse(req.url, true)

    const
        path = parsedUrl.pathname,
        trimmedPath = path.replace(/^\/+|\/+$/g,'')
    
    const 
        queryStringObject = parsedUrl.query

    const 
        method = req.method.toLowerCase()
    
    // Get the headers as an object
    const 
        headers = req.headers

    res.end('Hello Worlds')

    console.log('Request received headers: ', headers)
}
*/

//-- Parsing payloads
/*
import StringDecoder from 'string_decoder'

const server = (req, res) => {
    const 
        parsedUrl = url.parse(req.url, true)

    const
        path = parsedUrl.pathname,
        trimmedPath = path.replace(/^\/+|\/+$/g,'')
    
    const 
        queryStringObject = parsedUrl.query

    const 
        method = req.method.toLowerCase()
    
    const 
        headers = req.headers

    // Get the payload, if any
    const 
        decoder = new StringDecoder.StringDecoder('utf-8')
    let
        buffer = ''
    
    req.on('data', (data) => {
        buffer += decoder.write(data)
    })

    req.on('end', () => {

        buffer += decoder.end()

        res.end('Hello Worlds')

        console.log('Request received with this payload: ', buffer)
    })
    // On postman
    // POST - http://localhost:3000/foo
    // Body Raw:
    //   - Text : "This is the body we are sending"
    //-> Request received with this payload:  This is the body we are sending
}
*/

//-- Routing request
/*
import StringDecoder from 'string_decoder'

// Define the handlers
let 
    handlers = {}

// Sample handler
handlers.sample = (data, callback) => {
    // Callback a http status code, and a payload object
    callback(406, {'name' : 'sample handler'})
}

// Not found handler
handlers.notFound = (data, callback) => {
    callback(404);
}

const router = {
    'sample' : handlers.sample
}

const server = (req, res) => {
    const 
        parsedUrl = url.parse(req.url, true)

    const
        path = parsedUrl.pathname,
        trimmedPath = path.replace(/^\/+|\/+$/g,'')
    
    const 
        queryStringObject = parsedUrl.query

    const 
        method = req.method.toLowerCase()
    
    const 
        headers = req.headers

    const 
        decoder = new StringDecoder.StringDecoder('utf-8')
    let
        buffer = ''
    
    req.on('data', (data) => {
        buffer += decoder.write(data)
    })

    req.on('end', () => {

        buffer += decoder.end()

        // Chose the handler this request should go to. 
        // If one is not found, use the notFound handler
        const 
            chosenHandler = typeof(router[trimmedPath]) !== 'undefined'
                ? router[trimmedPath]
                : handlers.notFound

        // Construct the data object to send to the handle
        const data = {
            'trimmedPath' : trimmedPath,
            'queryStringObject' : queryStringObject,
            'method' : method,
            'headers' : headers,
            'payload' : buffer
        }

        // Route the request to the handler specified in the router
        chosenHandler(data, (statusCode, payload) => {
            // Use the status code called back by the handler, or default to 200
            statusCode = typeof(statusCode) == 'number'
                ? statusCode
                : 200
            
            // Use the payload called back by the handler, or default to
            payload = typeof(payload) == 'object'
                ? payload
                : {}
            
            // Convert the payload to a string
            const 
                payloadString = JSON.stringify(payload)
            
            // Return the response
            res.writeHead(statusCode)
            res.end(payloadString)

            // Log the request path
            console.log('Returning this response: ', statusCode, payloadString)
        })
    })
}
*/

//-- Returning JSON
/*
import StringDecoder from 'string_decoder'

let 
    handlers = {}

handlers.sample = (data, callback) => {
    callback(406, {'name' : 'sample handler'})
}

handlers.notFound = (data, callback) => {
    callback(404);
}

const router = {
    'sample' : handlers.sample
}

const server = (req, res) => {
    const 
        parsedUrl = url.parse(req.url, true)

    const
        path = parsedUrl.pathname,
        trimmedPath = path.replace(/^\/+|\/+$/g,'')
    
    const 
        queryStringObject = parsedUrl.query

    const 
        method = req.method.toLowerCase()
    
    const 
        headers = req.headers

    const 
        decoder = new StringDecoder.StringDecoder('utf-8')
    let
        buffer = ''
    
    req.on('data', (data) => {
        buffer += decoder.write(data)
    })

    req.on('end', () => {

        buffer += decoder.end()

        const 
            chosenHandler = typeof(router[trimmedPath]) !== 'undefined'
                ? router[trimmedPath]
                : handlers.notFound

        const data = {
            'trimmedPath' : trimmedPath,
            'queryStringObject' : queryStringObject,
            'method' : method,
            'headers' : headers,
            'payload' : buffer
        }

        chosenHandler(data, (statusCode, payload) => {
            statusCode = typeof(statusCode) == 'number'
                ? statusCode
                : 200
            
            payload = typeof(payload) == 'object'
                ? payload
                : {}
            
            const 
                payloadString = JSON.stringify(payload)
            
            // For return JSON
            res.setHeader('Content-Type', 'application/json')
            res.writeHead(statusCode)
            res.end(payloadString)

            console.log('Returning this response: ', statusCode, payloadString)
        })
    })
}
*/

//-- Adding configuration
/*
import StringDecoder from 'string_decoder'
import config from './config'

let 
    handlers = {}

handlers.sample = (data, callback) => {
    callback(406, {'name' : 'sample handler'})
}

handlers.notFound = (data, callback) => {
    callback(404);
}

const router = {
    'sample' : handlers.sample
}

const server = (req, res) => {
    const 
        parsedUrl = url.parse(req.url, true)

    const
        path = parsedUrl.pathname,
        trimmedPath = path.replace(/^\/+|\/+$/g,'')
    
    const 
        queryStringObject = parsedUrl.query

    const 
        method = req.method.toLowerCase()
    
    const 
        headers = req.headers

    const 
        decoder = new StringDecoder.StringDecoder('utf-8')
    let
        buffer = ''
    
    req.on('data', (data) => {
        buffer += decoder.write(data)
    })

    req.on('end', () => {

        buffer += decoder.end()

        const 
            chosenHandler = typeof(router[trimmedPath]) !== 'undefined'
                ? router[trimmedPath]
                : handlers.notFound

        const data = {
            'trimmedPath' : trimmedPath,
            'queryStringObject' : queryStringObject,
            'method' : method,
            'headers' : headers,
            'payload' : buffer
        }

        chosenHandler(data, (statusCode, payload) => {
            statusCode = typeof(statusCode) == 'number'
                ? statusCode
                : 200
            
            payload = typeof(payload) == 'object'
                ? payload
                : {}
            
            const 
                payloadString = JSON.stringify(payload)
            
            // For return JSON
            res.setHeader('Content-Type', 'application/json')
            res.writeHead(statusCode)
            res.end(payloadString)

            console.log('Returning this response: ', statusCode, payloadString)
        })
    })
}
*/

//--Adding HTTPS Support
// TODO

//-- Ping service and Storing data
import StringDecoder from 'string_decoder'
import config from './config'
import helpers from './helpers'
import handlers from './lib/handlers'
import _data from './lib/data'

let router = {
    'ping' : handlers.ping,
    'users' : handlers.users,
    'tokens' : handlers.tokens
}

const server = (req, res) => {
    const 
        parsedUrl = url.parse(req.url, true)

    const
        path = parsedUrl.pathname,
        trimmedPath = path.replace(/^\/+|\/+$/g,'')
    
    const 
        queryStringObject = parsedUrl.query

    const 
        method = req.method.toLowerCase()
    
    const 
        headers = req.headers

    const 
        decoder = new StringDecoder.StringDecoder('utf-8')
    let
        buffer = ''
    
    req.on('data', (data) => {
        buffer += decoder.write(data)
    })

    req.on('end', () => {

        buffer += decoder.end()

        const 
            chosenHandler = typeof(router[trimmedPath]) !== 'undefined'
                ? router[trimmedPath]
                : handlers.notFound

        const data = {
            'trimmedPath' : trimmedPath,
            'queryStringObject' : queryStringObject,
            'method' : method,
            'headers' : headers,
            'payload' : helpers.parseJsonToObject(buffer)
        }

        chosenHandler(data, (statusCode, payload) => {
            statusCode = typeof(statusCode) == 'number'
                ? statusCode
                : 200
            
            payload = typeof(payload) == 'object'
                ? payload
                : {}
            
            const 
                payloadString = JSON.stringify(payload)
            
            // For return JSON
            res.setHeader('Content-Type', 'application/json')
            res.writeHead(statusCode)
            res.end(payloadString)

            console.log('Returning this response: ', statusCode, payloadString)
        })
    })
}

export default server