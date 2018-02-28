const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const uuidv4 = require('uuid/v4')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { onJoin, onLeave, onRecieveIceCandidates } = require('./signal')

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
const port = process.env.PORT || 9000

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/view/home.html'))
})

app.get('/document/:documentid', function (req, res) {
  res.sendFile(path.join(__dirname, '/view/index.html'))
})

app.get('/generate', function (req, res) {
  const documentid = uuidv4().slice(0, 8)
  res.redirect('/document/' + documentid)
})

io.on('connection', function (socket) {
  console.log('A user connected')
  socket.on('join', data => onJoin(data, socket))
  socket.on('leave', data => onLeave(data))
  socket.on('ice candidates', data => onRecieveIceCandidates(data, socket))
})

server.listen(port, function () {
  console.log('Listening on port ' + port)
})
