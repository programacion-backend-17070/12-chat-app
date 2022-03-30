(async () => {
  const express = require('express');
  const path = require('path')
  const http = require('http')
  const mongoose = require("mongoose")
  const { Server } = require('socket.io');
  const cookieParser = require("cookie-parser")
  const session = require("express-session")
  // const FileStore = require("session-file-store")(session)

  // redis
  // const redis = require("redis")
  // const client = redis.createClient({
  //   url: "redis://default:<password>@redis-18447.c251.east-us-mz.azure.cloud.redislabs.com:18447",
  //   logErrors: true,
  //   legacyMode: true
  // })

  // client.on("error", (err) => console.log(err))
  // client.on("ready", () => console.log("connected"))
  // client.on("connect", () => console.log("Cache server connected"));
  // client.on("reconnecting", () => console.log("Cache server is attempting to reconnect"));
  // client.on("end", () => console.log("Cache server connection has been closed"));

  // const RedisStore = require("connect-redis")(session)
  // await client.connect()


  // mongo

  const MongoStore = require("connect-mongo")

  const templateEngine = require('./engine')
  const { mongoConfig } = require("./config")
  const chat = require("./chat")

  const viewRouter = require("./routers/view")
  const apiRouter = require("./routers/api")

  const { HOSTNAME, SCHEMA, DATABASE, USER, PASSWORD, OPTIONS } = mongoConfig
  const app = express()
  const server = http.createServer(app)
  const io = new Server(server)

  try {
    // await mongoose.connect(`${SCHEMA}://${USER}:${PASSWORD}@${HOSTNAME}/${DATABASE}?${OPTIONS}`)
    console.log(`${SCHEMA}://${USER}:${PASSWORD}@${HOSTNAME}/${DATABASE}?${OPTIONS}`)
    templateEngine(app)

    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(cookieParser("esto es un secreto")) // req.cookies = {}
    app.use(session({
      secret: "secret",
      resave: false,
      saveUninitialized: false,

      // store: new FileStore({ path: path.join(__dirname, "./sessions"), ttl: 60 })

      // store: new RedisStore({
      //   client,
      //   ttl: 10, // probar primero sin ttl
      // }),

      // store: new MongoStore({
      //   mongoUrl: `${SCHEMA}://${USER}:${PASSWORD}@${HOSTNAME}/${DATABASE}?${OPTIONS}`,
      //   expires: 1000 * 10
      // })


    })) // req.session
    app.use("/static", express.static(path.join(__dirname, 'public')))

    app.use("/", viewRouter)
    app.use("/api", apiRouter)

    io.on("connection", chat)
    server.listen(8080, () => console.log(`listening on http://localhost:8080`))
  } catch (e) {
    console.log("Error", e)
  }
})()
