const socket = io()
const $ = x => document.getElementById(x)
const docId = window.location.pathname.split('/')[1]

socket.on('connect', function () {
  socket.emit('join room', {docId: docId})
  socket.on('user joined', data => onUserJoined(data))
  socket.on('user left', data => onUserLeft(data))
  socket.on('message', data => onMessage(data))
  window.onbeforeunload = function () {
    socket.emit('leave room', {docId: docId})
  }
})

function onUserJoined (data) {
  renderUsers(data.users)
}

function onUserLeft (data) {
  renderUsers(data.users)
}

function onMessage (data) {
  if (socket.id !== data.from) {
    console.log('got data ', data)
  }
}

function sendMessage (type, data) {
  socket.emit('message', {
    type: type,
    docId: docId,
    data: data
  })
}

function renderUsers (users) {
  const html = users.reduce((a, l) => a + '<li>' + l + '</li>', '')
  $('users').innerHTML = html
}
