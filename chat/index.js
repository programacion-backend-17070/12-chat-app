const mensajeModel = require("../models/Mensaje")

const users = {}

module.exports = (socket) => {
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
  socket.on("iam", async (name) => {
    users[socket.id] = name

    // una vez que sabemos el nombre del usuario se le transmite 
    // el pool actual de usuarios conectados
    for (const u of Object.entries(users)) {
      socket.emit("users", { id: u[0], name: u[1] })
    }
    const messages = await mensajeModel.readMessages()
    socket.emit("messages", messages)
    socket.broadcast.emit("users", { id: socket.id, name })
  })

  // recibimos un mensaje y lo redirigimos a los demas
  socket.on("message", async (message) => {
    console.log(message)
    await mensajeModel.saveMessage(message)
    socket.broadcast.emit("message", message)
  })
}