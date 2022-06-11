const log4js = require('log4js')

const MIN_LEVEL = process.env.NODE_ENV == "production" ? 'info' : 'trace'
const log4jsConfig = {
  appenders: {
    app: { type: 'file', filename: 'logs/app.log' },
    console: { type: 'console' },
  },
  categories: {
    default: { appenders: ['console'], level: MIN_LEVEL },
    app: { appenders: ['app', 'console'], level:  MIN_LEVEL },
  },
  pm2: true
}
log4js.configure(log4jsConfig)

module.exports = {
  app: log4js.getLogger('app'),
}
