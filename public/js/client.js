const socket = io()
const $ = x => document.getElementById(x)
const docId = window.location.pathname.split('/')[1]
const peers = {}

socket.on('connect', function () {
  socket.emit('join room', {docId: docId})
  socket.on('user joined', data => onUserJoined(data))
  socket.on('user left', data => onUserLeft(data))
  socket.on('message', data => onMessage(data))
  window.onbeforeunload = onQuit
})

function joinedExistingRoom (data) {
  return data.users.length > 1 &&
    data.users.slice(-1)[0] === socket.id
}

function onUserJoined (data) {
  renderUsers(data.users)
  if (joinedExistingRoom(data)) {
    data.users.filter(u => u !== socket.id).forEach(u => {
      peers[u] = new Peer(u)
      peers[u].offer()
    })
  } else if (data.users.length > 1) {
    const remoteUser = data.users.slice(-1)[0]
    peers[data.users.slice(-1)[0]] = new Peer(remoteUser)
  }
}

function onUserLeft (data) {
  renderUsers(data.users)
  // close connection with the left user
  // delete it from peers
}

function onMessage (data) {
  console.log('Got message', data)
  peers[data.from].onSignalingMessage(data)
}

function onQuit (data) {
  socket.emit('leave room', {docId: docId})
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
