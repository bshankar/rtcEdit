class Peer {
  constructor () {
    this.pc = new RTCPeerConnection(null)
    this.pc.onicecandidate = event => this.onicecandidate(event)
    this.iceCandidates = []
    this.createOffer()
  }

  createOffer () {
    this.pc.createOffer(this.getSdpConstraints())
      .then(offer => this.pc.setLocalDescription(offer))
      .then(() => { console.log('offer created') })
      .catch(function (reason) {
        console.log('error creating offer. reason: ', reason)
      })
  }

  onicecandidate (event) {
    if (event.candidate) {
      this.iceCandidates.push({
        type: 'candidate',
        label: event.candidate.sdpMLineIndex,
        id: event.candidate.sdpMid,
        candidate: event.candidate.candidate,
        foundation: event.candidate.foundation
      })
    } else {
      sendMessage('ice candidates', this.iceCandidates)
    }
  }

  // onIceCandidates (data) {
  //   if (data.type === 'offer') {
  //     this.pc.createAnswer(this.onLocalSessionCreated)
  //   }
  //   const peer = this
  //   this.pc.setRemoteDescription(new RTCSessionDescription(data))
  //     .then(peer.addRemoteIceCandidates(data))
  //     .catch(console.error('Error setting remote description!'))
  // }

  // addRemoteIceCandidates (data) {
  //   console.log('Adding remote ice candidates and creating answer')
  //   data.iceCandidates.forEach((ic) => {
  //     const candidate = new RTCIceCandidate({
  //       sdpMLineIndex: ic.label,
  //       sdpMid: ic.id,
  //       candidate: ic.candidate
  //     })
  //     this.pc.addIceCandidate(candidate)
  //       .then(() => console.log('Added ice candidate'))
  //       .catch(e => console.error('Error: adding ice candidate failed', e))
  //   })
  // }

  // onLocalSessionCreated () {

  // }

  getSdpConstraints () {
    return ({
      mandatory: {
        'OfferToReceiveAudio': true,
        'OfferToReceiveVideo': true
      },
      'offerToReceiveAudio': true,
      'offerToReceiveVideo': true
    })
  }
}
