class Peer {
  constructor (to) {
    this.to = to
    this.pc = new RTCPeerConnection(servers)
    this.pc.onicecandidate = event => this.onicecandidate(event)
    this.pc.ondatachannel = onDataChannel.bind(this)
    this.createDataChannel = createDataChannel.bind(this)
  }

  async offer () {
    try {
      this.createDataChannel(docId, socket.id)
      const offer = await this.pc.createOffer(this.sdpConstraints())
      await this.pc.setLocalDescription(offer)
      sendMessage('offer', offer, this.to)
    } catch (e) {
      console.error('Creating offer failed. Reason: ', e)
    }
  }

  onicecandidate (event) {
    if (event.candidate) {
      sendMessage('candidate', {
        label: event.candidate.sdpMLineIndex,
        id: event.candidate.sdpMid,
        candidate: event.candidate.candidate,
        foundation: event.candidate.foundation
      }, this.to)
    }
  }

  async onOffer (data) {
    try {
      await this.pc.setRemoteDescription(new RTCSessionDescription(data))
      const answer = await this.pc.createAnswer()
      this.pc.setLocalDescription(answer)
      sendMessage('answer', answer, this.to)
    } catch (e) {
      console.error('Error while creating answer ', e)
    }
  }

  async onAnswer (data) {
    this.pc.setRemoteDescription(new RTCSessionDescription(data))
  }

  onRemoteCandidate (data) {
    const iceCandidate = {
      candidate: data.candidate,
      sdpMLineIndex: data.label
    }
    this.pc.addIceCandidate(new RTCIceCandidate(iceCandidate))
      .catch(e => console.error('Error adding ice candidate:', e))
  }

  onSignalingMessage (message) {
    if (message.type === 'offer') {
      this.onOffer(message.data)
    } else if (message.type === 'answer') {
      this.onAnswer(message.data)
    } else if (message.type === 'candidate') {
      this.onRemoteCandidate(message.data)
    }
  }

  sdpConstraints () {
    return ({
      mandatory: {
        OfferToReceiveAudio: true,
        OfferToReceiveVideo: true
      },
      offerToReceiveAudio: true,
      offerToReceiveVideo: true
    })
  }
}
