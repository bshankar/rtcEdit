function getUsers (room, io) {
  const _room = io.sockets.adapter.rooms[room]
  if (_room) {
    const sockets = _room['sockets']
    return { users: Object.keys(sockets) }
  }
}

function onJoin (data, socket, io) {
  socket.join(data.docId)
  io.to(data.docId).emit('user joined', getUsers(data.docId, io))
}

function onLeave (data, socket, io) {
  socket.leave(data.docId)
  io.to(data.docId).emit('user left', getUsers(data.docId, io))
}

function onMessage (data, socket, io) {
  const _data = {from: socket.id, ...data}
  if (data.to) {
    io.to(data.to).emit('message', _data)
  } else {
    socket.broadcast.to(data.docId).emit('message', _data)
  }
}

module.exports = { onJoin, onLeave, onMessage }
