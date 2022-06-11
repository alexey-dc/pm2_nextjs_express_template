const blib = {
  log: require("./log.js"),
  data: require("./data.js"),

  init: async () => {
    await blib.data.init()
  },
  cleanup: async () => {
    await blib.data.cleanup()
  },
}

module.exports = blib