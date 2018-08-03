import crypto from 'crypto'
import config from './config'

let helpers = {}

// Create a SHA256 hash
helpers.hash = (str) => {
    if(typeof(str) == 'string' && str.length > 0) {
        const hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex')
    }
    else {
        return false
    }
}

helpers.parseJsonToObject = (str) => {
    try {
        let obj = JSON.parse(str)
        return obj
    }
    catch(e) {
        return {}
    }
}

export default helpers