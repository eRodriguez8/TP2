const dotenv = require('dotenv')
dotenv.config()

const dbConfigs = {
    local: {
        client: 'sqlite3',
        connection: { filename: './database/mydb.sqlite' },
        useNullAsDefault: true
    }
}

const srvConfigs = {
    port: process.env.PORT || 5000,
    env: process.env.DB_ENV,
    mode: process.env.MODE
}

module.exports = {
    dbConfig: dbConfigs[srvConfigs.env],
    port: srvConfigs.port,
    mode: srvConfigs.mode
}