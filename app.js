module.exports = (async () => {
  const express = require('express');
  const path = require('path')
  const http = require('http')
  const mongoose = require("mongoose")
  const { Server } = require('socket.io');
  const cookieParser = require("cookie-parser")
  const session = require("express-session")
  // const FileStore = require("session-file-store")(session)
  
  // mongo store
  const MongoStore = require("connect-mongo")

  const templateEngine = require('./engine')
  const { mongoConfig, redisConfig } = require("./config")
  const chat = require("./chat")

  const viewRouter = require("./routers/view")
  const apiRouter = require("./routers/api")

  const { HOSTNAME, SCHEMA, DATABASE, USER, PASSWORD, OPTIONS } = mongoConfig
  const app = express()
  const server = http.createServer(app)
  const io = new Server(server)

  const PORT = process.env.PORT || 8080
  try {
    await mongoose.connect(`${SCHEMA}://${USER}:${PASSWORD}@${HOSTNAME}/${DATABASE}?${OPTIONS}`)

    console.log(`${SCHEMA}://${USER}:${PASSWORD}@${HOSTNAME}/${DATABASE}?${OPTIONS}`)
    // redis
    // setear el cliente de redis
    // que va a ocupar el Store
    // const redis = require("redis") // cliente de redis
    // const RedisStore = require("connect-redis")(session) // store de redis

    // console.log(redisConfig)
    // const redisClient = redis.createClient({
    //   url: `redis://default:${redisConfig.PASSWORD}@redis-18447.c251.east-us-mz.azure.cloud.redislabs.com:18447`,
    //   legacyMode: true
    // })

    // redisClient.on("ready", () => console.log("redis is ready"))
    // redisClient.on("error", (err) => console.log("error", err))

    // await redisClient.connect()

    templateEngine(app)

    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(cookieParser("esto es un secreto")) // req.cookies = {}
    app.use(session({
      secret: "secret",
      resave: true,
      saveUninitialized: true,

      store: new MongoStore({
        mongoUrl: `${SCHEMA}://${USER}:${PASSWORD}@${HOSTNAME}/${DATABASE}?${OPTIONS}`,
        ttl: 1 * 60,
        expires: 1000 * 1 * 60,
        autoRemove: "native"
      })
    })) // req.session
    app.use("/static", express.static(path.join(__dirname, 'public')))

    app.use("/", viewRouter)
    app.use("/api", apiRouter)

    io.on("connection", chat)
    server.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`))
    return server
  } catch (e) {
    console.log("Error", e)
  }
})()
