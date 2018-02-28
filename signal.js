// docs = {"doc_name": {user1: socket1, user2: socket2, ...}
// data = {"docId": "id", "userId": "id"}
const docs = {}

function onJoin (data, socket) {
  const docId = data.docId
  const userId = data.userId
  console.log('User ' + userId + ' joining document ' + docId)
  const doc = docs[docId]
  if (doc && !(userId in doc)) {
    doc[userId] = socket
    const users = Object.keys(doc)
    Object.values(doc).forEach(s => s.emit('user joined', {users: users, docId: docId}))
  } else if (!doc) {
    docs[docId] = {[userId]: socket}
    socket.emit('user joined', {users: [userId], docId: docId})
  } else {
    socket.emit('join error', 'user already exists')
  }
}

function onLeave (data, socket) {
  const docId = data.docId
  const userId = data.userId
  console.log('User ' + userId + ' leaving document ' + docId)
  const doc = docs[docId]
  if (doc) {
    if (doc[userId]) {
      delete doc[userId]
      const users = Object.keys(doc)
      Object.values(doc).forEach(s => s.emit('user left', {users: users, docId: docId}))
    }
    if (Object.keys(doc).length === 0) {
      delete docs[docId]
    }
  }
}

function onRecieveIceCandidates (data, socket) {
  const docId = data.docId
  Object.values(docs[docId])
    .filter(s => s.id !== socket.id)
    .forEach(s => s.emit('ice candidates', {...data, userId: socket.id}))
}

module.exports = { onJoin, onLeave, onRecieveIceCandidates }
