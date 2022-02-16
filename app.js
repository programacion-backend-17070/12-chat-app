const express = require('express');
const path = require('path')
const http = require('http')
const { Server } = require('socket.io');

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use("/static", express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')))

const users = {}

io.on('connection', (socket) => {
  // cuando un nueva connection llega al server
  console.log(`an user connected: ${socket.id}`)
  
  // callback para saber cuando se ha desconectado
  socket.on('disconnect', () => {
    console.log('user disconnected');

    // borramos el usuario de la lista
    // emitir el evento de desconexion
    delete users[socket.id]
    socket.broadcast.emit("offline", socket.id)
  });

  // callback cuando el usuario se 'presenta'
  // guardamos el nombre en el pool de usuarios
  socket.on("iam", (name) => {
    users[socket.id] = name

    // una vez que sabemos el nombre del usuario se le transmite 
    // el pool actual de usuarios conectados
    for (const u of Object.entries(users)) {
      socket.emit("users", { id: u[0], name: u[1] })
    }

    socket.broadcast.emit("users", { id: socket.id, name })
  })

  // recibimos un mensaje y lo redirigimos a los demas
  socket.on("message", (message) => {
    console.log(message)
    socket.broadcast.emit("message", message)
  })
})

server.listen(8080, () => console.log(`listening on http://localhost:8080`))
