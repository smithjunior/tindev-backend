const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://omnistack8_tindev:omnistack8_tindev@cluster0-45kku.mongodb.net/omnistack8_tindev?retryWrites=true&w=majority', { useNewUrlParser: true })

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

server.listen(3333)
