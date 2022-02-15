const express = require('express');
const path = require('path')
const http = require('http')
const { Server } = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use("/static", express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')))

io.on('connection', (socket) => {
  console.log(`an user connected: ${socket.id}`)
})

server.listen(8080, () => console.log(`listening on http://localhost:8080`))
