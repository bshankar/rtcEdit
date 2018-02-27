const socket = io()
const $ = x => document.getElementById(x)

function getMsg (userId, docId) {
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
})

function renderUsers (users) {
  const html = users.reduce((a, l) => a + '<li>' + l + '</li>', '')
  $('users').innerHTML = html
}
