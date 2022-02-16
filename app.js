const express = require('express');
const path = require('path')
const http = require('http')

const app = express()
const server = http.createServer(app)

app.use("/static", express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')))


server.listen(8080, () => console.log(`listening on http://localhost:8080`))
