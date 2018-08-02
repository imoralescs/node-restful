import http from 'http'
import { PORT } from 'babel-dotenv'
import { createServer } from 'http'

import app from './server'

// The server should respond to all requests with a string
const server = http.createServer(app)

let currentApp = app

// Start the server, and have it listen on port 3000
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})

if(module.hot) {
    module.hot.accept(['./server'], () => {
        server.removeListener('request', currentApp)
        server.on('request', app)
        currentApp = app
	})
}