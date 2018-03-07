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

function joinedExistingRoom (data) {
  return data.users[data.users.length - 1] === socket.id &&
    data.users.length > 1
}

function onUserJoined (data) {
  renderUsers(data.users)
  if (joinedExistingRoom(data)) {
    peer.offer()
  }
}

function onUserLeft (data) {
  renderUsers(data.users)
}

function onMessage (data) {
  peer.onSignalingMessage(data)
}

function sendMessage (type, data, to) {
  socket.emit('message', {
    type: type,
    to: to,
    docId: docId,
    data: data
  })
}

function renderUsers (users) {
  const html = users.reduce((a, l) => a + '<li>' + l + '</li>', '')
  $('users').innerHTML = html
}
