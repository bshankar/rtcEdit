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
  Object.keys(peers).filter(e => data.users.indexOf(e) === -1)
    .forEach(u => {
      peers[u].pc.close()
      delete peers[u]
    })
}

function onMessage (data) {
  peers[data.from].onSignalingMessage(data)
}

function onQuit (data) {
  socket.emit('leave room', {docId: docId})
  Object.values(peers).forEach(p => p.pc.close())
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
