const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const uuidv4 = require('uuid/v4')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { getUsers } = require('./util')

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
    io.to(data.docId).emit('user joined', getUsers(io, data.docId))
  })

  socket.on('leave room', data => {
    socket.leave(data.docId)
    io.to(data.docId).emit('user left', getUsers(io, data.docId))
  })

  socket.on('message', data => {
    io.to(data.docId).emit('message', {from: socket.id, ...data})
  })
})

server.listen(port, function () {
  console.log('Listening on port ' + port, '\n')
})
