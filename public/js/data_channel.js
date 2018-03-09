const options = {
  reliable: true,
  maxPacketLifeTime: 3000 // ms
}

function onDCMessage (event, channel) {
  console.log('data channel: MESSAGE', event.data)
}

function onDCError (event, channel) {
  console.error('data channel: ERROR: ', event)
}

function onDCOpen (channel) {
  console.log('data channel: OPEN')
  channel.send('Hello World!')
}

function onDCClose (channel) {
  console.log('data channel: CLOSE')
  this.dataChannel = null
}

function addHandlers (channel) {
  console.log('data channel: ADD HANDLERS')
  channel.onopen = () => onDCOpen(channel)
  channel.onclose = () => onDCClose(channel)
  channel.onmessage = (event) => onDCMessage(event, channel)
  channel.onerror = (event) => onDCError(event, channel)
}

function createDataChannel (docId, userId) {
  this.dataChannel = this.pc.createDataChannel(docId + userId, options)
  console.log('data channel: CREATE')
  addHandlers(this.dataChannel)
}

function onDataChannel (event) {
  console.log('data channel: DISCOVER')
  this.dataChannel = event.channel
  addHandlers(this.dataChannel)
}
