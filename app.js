(async () => {
  const express = require('express');
  const path = require('path')
  const http = require('http')
  const mongoose = require("mongoose")
  const { Server } = require('socket.io');
  const cookieParser = require("cookie-parser")

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
    await mongoose.connect(`${SCHEMA}://${USER}:${PASSWORD}@${HOSTNAME}/${DATABASE}?${OPTIONS} `)
    
    templateEngine(app)
    
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(cookieParser("secreto"))
    app.use("/static", express.static(path.join(__dirname, 'public')))
    app.use("/", viewRouter)
    app.use("/api", apiRouter)
    
    io.on("connection", chat)
    server.listen(8080, () => console.log(`listening on http://localhost:8080`))
  } catch (e) {
    console.log("Error", e)
  }
})()
