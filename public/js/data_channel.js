const dataChannelOptions = {
  reliable: true,
  maxPacketLifeTime: 3000 // ms
}

function createDataChannel (docId, userId) {
  const dataChannel = this.pc.createDataChannel(docId + userId)
  console.log('CREATE data channel')

  dataChannel.onerror = function (error) {
    console.error('Data Channel Error:', error)
  }

  dataChannel.onmessage = function (event) {
    console.log('Got Data Channel Message:', event.data)
  }

  dataChannel.onopen = function () {
    console.log('Data channel opened!!')
    dataChannel.send('Hello World!')
  }

  dataChannel.onclose = function () {
    console.log('The Data Channel is Closed')
  }
  return dataChannel
}

function onDataChannel (event) {
  console.log('CREATE data channel @reciever !!')
  this.dataChannel = event.channel
  this.dataChannel.onopen = () => {
    console.log('OPEN data channel @reciever !!')
  }
  this.dataChannel.onmessage = function (event) {
    console.log('Got message: ', event.data)
  }
}
