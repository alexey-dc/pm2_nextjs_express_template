class Api {
  constructor(express) {
    this.express = express
  }

  init() {
    this.express.get("/api/get", (req, res) => {
      res.send({  i: blib.data.value })
    })

    this.express.post("/api/increment", (req, res) => {
      blib.data.incr()
      res.send({ i: blib.data.value })
    })
  }


}

module.exports = Api
