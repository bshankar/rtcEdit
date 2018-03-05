function getUsers (room, io) {
  const _room = io.sockets.adapter.rooms[room]
  if (_room) {
    const sockets = _room['sockets']
    return { users: Object.keys(sockets) }
  }
}

function findSocket (id, room, io) {
  const _room = io.sockets.adapter.rooms[room]
  return _room[id]
}

module.exports = { getUsers, findSocket }
