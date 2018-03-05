const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const uuidv4 = require('uuid/v4')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { getUsers, findSocket } = require('./util')

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
const port = process.env.PORT || 9000

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/view/home.html'))
})

app.get('/generate', function (req, res) {
  res.redirect('/' + uuidv4())
})

app.get('/:docId', function (req, res) {
  res.sendFile(path.join(__dirname, '/view/index.html'))
})

io.on('connection', function (socket) {
  console.log(socket.id + ' connected')

  socket.on('join room', data => {
    socket.join(data.docId)
    io.to(data.docId).emit('user joined', getUsers(data.docId, io))
  })

  socket.on('leave room', data => {
    socket.leave(data.docId)
    io.to(data.docId).emit('user left', getUsers(data.docId, io))
  })

  socket.on('message', data => {
    const _data = {from: socket.id, ...data}
    if (data.to) {
      findSocket(data.to).emit('message', _data)
    } else {
      socket.broadcast.to(data.docId).emit('message', _data)
    }
  })
})

server.listen(port, function () {
  console.log('Listening on port ' + port, '\n')
})
