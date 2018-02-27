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
  } else if (!doc) {
    docs[docId] = {[userId]: socket}
  } else {
    socket.emit('join error', 'user already exists')
  }
}

function onLeave (data, socket) {
  const docId = data.docId
  const userId = data.userId
  console.log('User ' + userId + ' leaving document ' + docId)
  if (docs[docId]) {
    if (docs[docId][userId]) {
      delete docs[docId][userId]
    }
    if (Object.keys(docs[docId]).length === 0) {
      delete docs[docId]
    }
  }
}

module.exports = { onJoin, onLeave }
