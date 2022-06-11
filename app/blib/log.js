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
  /*
    Some folks suggest using {disableClustering: true} to get log4js working with pm2
    https://www.gitmemory.com/issue/log4js-node/log4js-node/265/544974438

    Others suggest using the pm2-intercom package, which hasn't been updated in 6 years...
    https://github.com/log4js-node/log4js-node/blob/master/docs/clustering.md

    Here's a discussion around it
    https://github.com/log4js-node/log4js-node/issues/265
    particularly this
    https://github.com/log4js-node/log4js-node/issues/265#issuecomment-331090803

    However, using raw pm2-intercom results in an error:
    ```
      4|pm2-intercom  | Error: ID, DATA or TOPIC field is missing
    ```
    This appears to be because of the
    ```
      process.send('ready')
    ```
    Message we send at the start of the process
    (https://pm2.keymetrics.io/docs/usage/signals-clean-restart/)

    Someone has graciously forked pm2-intercom just for this
    https://www.npmjs.com/package/pm2-graceful-intercom

    so we want to do
    pm2 install pm2-graceful-intercom

    NOTE: pm2 install pm2-graceful-intercom, NOT npm install pm2-graceful-intercom
  */
  pm2: true
}
log4js.configure(log4jsConfig)

module.exports = {
  app: log4js.getLogger('app'),
}
