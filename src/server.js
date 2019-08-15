require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const routes = require('./routes')
const app = express()

const server = require('http').Server(app)

const io = require('socket.io')(server)

const connectedDevs = {}

io.on('connection', socket => {
  const { dev } = socket.handshake.query
  connectedDevs[dev] = socket.id
})

mongoose.connect(process.env.MONGO_CONNECTION, { useNewUrlParser: true })

app.use((request, response, next) => {
  request.io = io
  request.connectedDevs = connectedDevs
  return next()
})
app.use(cors())
app.use(express.json())
app.use(routes)

server.listen(process.env.PORT || 3333)
