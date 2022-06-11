require("dotenv").config()

const Server = require("./app/server.js")
/*
  blib stands for "backend lib".

  Using a name like "lib" may not be wise with a NextJS+Express setup, since
  react code is executed on the backend - and has access to backend globals.

  I.e. if there is also a front end "lib" - it would cause a naming conflict,
  and lead to surprising behavior.
*/
const blib = require("./app/blib/_blib.js")
/*
  Node's native support for working across threads
  https://nodejs.org/api/cluster.html#cluster
*/
const cluster = require("cluster")

const begin = async () => {
  global.blib = blib
  global.log = blib.log
  /*
    https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/errorhandling/catchunhandledpromiserejection.md
  */
  process.on('unhandledRejection', (reason, p) => {
    log.app.error("Unhandled rejection", reason)
    throw reason;
  });

  process.on('uncaughtException', (error) => {
    log.app.error("Ucaught exception", error)
    // With pm2 this just restarts
    process.exit(1);
  });

  process.on('SIGINT', async () => {
    log.app.info("---------- Stopping ------------")
    /*
      This is for pm2: it begins teardown with a SIGINT,
      which is the opportunity to finish any in-flight requests,
      clean up database connections, etc.

      https://pm2.keymetrics.io/docs/usage/signals-clean-restart/
    */
    try {
      await global._server.stop()
      await blib.cleanup()
      log.app.info("Cleanup complete. Exiting.")
      process.exit(0)
    } catch {
      log.app.error("Sonething went wrong during shutdown")
      process.exit(1)
    }
  })

  log.app.info(`----- Starting ${process.env.NODE_ENV}/${process.env.DEPLOY_ENV} ------`)
  await blib.init()

  if(cluster.isMaster) {
    log.app.info(`(master thread) ${process.env.NODE_ENV}/${process.env.DEPLOY_ENV} started`)
  } else {
    if(cluster.isWorker && cluster.worker) {
      log.app.info(`(worker ${cluster.worker.id}) ${process.env.NODE_ENV}/${process.env.DEPLOY_ENV} started`)
    } else {
      log.app.warn(`(unknown thread) ${process.env.NODE_ENV}/${process.env.DEPLOY_ENV} started`)
    }
  }

  const server = new Server(process.env.EXPRESS_PORT)
  await server.start()
  log.app.info(`Server running in --- ${process.env.NODE_ENV}/${process.env.DEPLOY_ENV} --- on port ${process.env.EXPRESS_PORT}`)

  /*
    This is handy if we want to debug a live process
    that we're connecting to from outside
    (e.g. when using `pnpm debug`, see package.json/README.md).
  */
  global._server = server
  /*
    Let pm2 know the app is ready
    https://pm2.keymetrics.io/docs/usage/signals-clean-restart/
  */
  if (process.send) {
    process.send('ready')
  }
}

begin()
