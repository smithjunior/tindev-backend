require('dotenv').config()

const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_CONNECTION, { useNewUrlParser: true })

const cors = require('cors')

const express = require('express')
const routes = require('./routes')
const app = express()

const server = require('http').Server(app)

const io = require('socket.io')(server)

const connectDevs = {}

io.on('connection', socket => {
  const { dev } = socket.handshake.query
  connectDevs[dev] = socket.id
  console.log(connectDevs)
})

app.use((request, response, next) => {
  request.io = io
  request.connectDevs = connectDevs
  return next()
})
app.use(cors())
app.use(express.json())
app.use(routes)

server.listen(process.env.PORT || 3333)
