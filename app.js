const express = require('express');
const path = require('path')
const http = require('http')
const { Server } = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use("/static", express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')))

const users = {}
const msg = [] // base de datos de mensajes ( es un array :P)

io.on("connection", (socket) => {
  // cuando un nueva connection llega al server
  console.log(`an user connected: ${socket.id}`)

  socket.on("iam", (name) => {
    users[socket.id] = name

    console.log(users)
    // for of
    // for in
    // Object.entries => [ [key, value] ]
    for (const u of Object.entries(users)) {
      // u => [key, value]

      // enviar al usuario recien conectado
      // los usuarios actualmente en linea
      // {
      //   id: socket.id,
      //   name: nombre de usuario
      // }
      socket.emit("users", { id: u[0], name: u[1] })
    }

    // emitir el evento de que un nuevo usuario esta en linea
    socket.broadcast.emit("users", { id: socket.id, name })

    for (const m of msg) {
      socket.emit("message", m)
    }
  })

  socket.on("message", (data) => {
    console.log(data)
    msg.push(data)
    // retransmitir mensaje
    socket.broadcast.emit("message", data)
  })
})

server.listen(8080, () => console.log(`listening on http://localhost:8080`))
