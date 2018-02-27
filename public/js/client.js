const socket = io()

function getMsg (userId, docId) {
  console.log('generating data with ', userId, docId)
  return {userId: userId, docId: docId}
}

socket.on('connect', function () {
  const docId = window.location.pathname.split('/')[2]
  socket.emit('join', getMsg(socket.id, docId))

  window.onbeforeunload = function () {
    socket.emit('leave', getMsg(socket.id, docId))
  }

  socket.on('join error', function () {
    console.log('Network error!')
  })
})
