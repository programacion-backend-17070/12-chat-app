const express = require('express');
const path = require('path')
const http = require('http')
const { Server } = require('socket.io');
const { SocketAddress } = require('net');

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use("/static", express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')))

const users = {}

io.on('connection', (socket) => {
  console.log(`an user connected: ${socket.id}`)
  
  socket.on('disconnect', () => {
    console.log('user disconnected');
    socket.broadcast.emit("offline", socket.id)
  });

  socket.on("iam", (name) => {
    users[socket.id] = name
    for (const u of Object.entries(users)) {
      socket.emit("users", { id: u[0], name: u[1] })
    }

    socket.broadcast.emit("users", { id: socket.id, name })
  })

  socket.on("message", (message) => {
    console.log(message)
    socket.broadcast.emit("message", message)
  })
})

server.listen(8080, () => console.log(`listening on http://localhost:8080`))
