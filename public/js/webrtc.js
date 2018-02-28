class Peer {
  constructor () {
    this.pc = null
    this.iceCandidates = []
    this.createConnection()
  }

  createConnection (id, sendMessage) {
    this.pc = new RTCPeerConnection(null)
    this.pc.onicecandidate = function (event) {
      if (event.candidate) console.log(event)
    }

    this.pc.createOffer(this.getSdpConstraints())
      .then(offer => { console.log(offer); this.pc.setLocalDescription(offer) })
      .then(() => { console.log('offer created') })
      .catch(function (reason) {
        console.log('error creating offer. reason: ', reason)
      })
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
