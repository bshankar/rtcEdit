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
        docId: docId,
        label: event.candidate.sdpMLineIndex,
        id: event.candidate.sdpMid,
        candidate: event.candidate.candidate,
        foundation: event.candidate.foundation
      })
    } else {
      sendMessage('ice candidates', this.iceCandidates)
    }
  }

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

const peer = new Peer()
