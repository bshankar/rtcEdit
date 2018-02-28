const socket = io()
const $ = x => document.getElementById(x)
const docId = window.location.pathname.split('/')[2]

function getMsg (userId, docId) {
  return {userId: userId, docId: docId}
}

socket.on('connect', function () {
  socket.emit('join', getMsg(socket.id, docId))

  window.onbeforeunload = function () {
    socket.emit('leave', getMsg(socket.id, docId))
  }

  socket.on('join error', function () {
    console.log('Network error!')
  })

  socket.on('user joined', function (data) {
    if (data.docId === docId) {
      renderUsers(data.users)
    }
  })

  socket.on('user left', function (data) {
    if (data.docId === docId) {
      renderUsers(data.users)
    }
  })

  socket.on('ice candidate', function (data) {
    console.log('received other ice candidate', data)
  })
})

function sendMessage (event, data) {
  if (socket.connected === true) {
    socket.emit(event, {...data, docId: docId})
  } else {
    console.error('Error sending message. Socket is not connected!')
  }
}

function renderUsers (users) {
  const html = users.reduce((a, l) => a + '<li>' + l + '</li>', '')
  $('users').innerHTML = html
}
