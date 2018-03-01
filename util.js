function getUsers (io, room) {
  const _room = io.sockets.adapter.rooms[room]
  if (_room) {
    const sockets = _room['sockets']
    return { users: Object.keys(sockets) }
  }
}

module.exports = { getUsers }
