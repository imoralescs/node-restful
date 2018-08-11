import url from 'url'
import StringDecoder from 'string_decoder'
import config from './config'
import helpers from './helpers'
import handlers from './lib/handlers'
import _data from './lib/data'

//--Adding HTTPS Support
// TODO

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
            
            res.setHeader('Content-Type', 'application/json')
            res.writeHead(statusCode)
            res.end(payloadString)
        })
    })
}

export default server