const blib = {
  log: require("./log.js"),
  data: require("./data.js"),

  init: async () => {
    blib.log.app.info("----- Initializing backend library -----")
    await blib.data.init()
    blib.log.app.info("----- Initialized backend library -----")
  },
  cleanup: async () => {
    blib.log.app.info("----- Cleaning backend library -----")
    await blib.data.cleanup()
    blib.log.app.info("----- Cleaned backend library -----")
  },
}

module.exports = blib
