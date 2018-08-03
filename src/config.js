/*
 * Create and export configuration variables
 */

// Container for all the enviroments
let enviroments = {}

// Staging (default) enviroment
enviroments.staging = {
    'port' : 3000,
    'envName' : 'staging',
    'hashingSecret' : 'secret'
}

// Production enviroment
enviroments.production = {
    'port' : 5000,
    'envName' : 'production',
    'hashingSecret' : 'secret'
}

// Determine whic enviroment was passed as a command-line argument
const currentEnviroment = typeof(process.env.NODE_ENV) == 'string'
    ? process.env.NODE_ENV.toLocaleLowerCase()
    : ''

// Check that the current enviroment is one of the enviroment above, if not, default to staging
const enviromentToExport = typeof(enviroments[currentEnviroment]) == 'object'
    ? enviroments[currentEnviroment]
    : enviroments.staging

export default enviromentToExport