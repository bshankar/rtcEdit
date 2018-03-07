const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const uuidv4 = require('uuid/v4')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { onJoin, onLeave, onMessage } = require('./util')

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
  socket.on('join room', data => onJoin(data, socket, io))
  socket.on('leave room', data => onLeave(data, socket, io))
  socket.on('message', data => onMessage(data, socket, io))
})

server.listen(port, function () {
  console.log('Listening on port ' + port, '\n')
})
