<template>
  <div id="call">
    <video id="user-feedback" autoplay></video>
    <video id="user-call" autoplay></video>
    <button id="startButton"></button>
    <button id="callButton"></button>
    <button @click="hangup" id="hangupButton"></button>
  </div>
</template>

<script>
  import socket from '../sockets'
  // eslint-disable-next-line no-unused-vars
  import adapter from 'webrtc-adapter'

  export default {
    name: 'Call',
    data () {
      return {
        isChannelReady: false,
        isInitiator: false,
        isStarted: false,

        localVideo: null,
        localStream: null,

        remoteVideo: null,
        remoteStream: null,

        constraints: {
          audio: true,
          video: true
        },
        sdpConstraints: {
          offerToReceiveVideo: 1,
          offerToReceiveAudio: 1
        },

        pc: null,
        turnReady: null,

        startButton: null,
        callButton: null,
        hangupButton: null
      }
    },

    computed: {
      user () {
        // const user = this.$store.state.users.find(user => user.socket_id === this.$route.params.user_id)
        // if (user === undefined) return this.$router.push('/users')
        return 'user'
      },
      roomId () {
        return this.$route.params.user_id
      }
    },
    mounted () {
      this.localVideo = document.getElementById('user-feedback')
      this.remoteVideo = document.getElementById('user-call')

      this.localVideo.addEventListener('loadedmetadata', this.logVideoLoaded)
      this.remoteVideo.addEventListener('loadedmetadata', this.logVideoLoaded)
      this.remoteVideo.addEventListener('onresize', this.logResizedVideo)

      this.startButton = document.getElementById('startButton')
      this.callButton = document.getElementById('callButton')
      this.hangupButton = document.getElementById('hangupButton')

      this.callButton.disabled = true
      this.hangupButton.disabled = true

      navigator.mediaDevices.getUserMedia({
        video: true
      })
        .then(this.gotStream)
        .catch(function (e) {
          alert('getUserMedia() error: ' + e.name)
        })
      console.log(socket)
      console.log(this.roomId)
      socket.emit('create-or-join', this.roomId)

      socket.on('created-room', (room, socketId) => {
        this.isInitiator = true
        this.isChannelReady = true
        socket.emit('call_user', {roomId: this.roomId, callerName: this.$store.state.username})
        console.log('room created')
      })
      socket.on('joined-room', (room, socketId) => {
        console.log('room joined')
        this.isInitiator = false
        this.isChannelReady = true
      })

      socket.on('room-ready', () => {
        console.log('this room is ready : ', this.roomId)
      })

      socket.on('message', (message) => {
        console.log('Client received message:', message)
        if (message === 'got user media') {
          this.maybeStart()
        } else if (message.type === 'offer') {
          if (!this.isInitiator && !this.isStarted) {
            this.maybeStart()
          }
          this.pc.setRemoteDescription(new RTCSessionDescription(message))
          this.doAnswer()
        } else if (message.type === 'answer' && this.isStarted) {
          this.pc.setRemoteDescription(new RTCSessionDescription(message))
        } else if (message.type === 'candidate' && this.isStarted) {
          let candidate = new RTCIceCandidate({
            sdpMLineIndex: message.label,
            candidate: message.candidate
          })
          this.pc.addIceCandidate(candidate)
        } else if (message === 'bye' && this.isStarted) {
          this.handleRemoteHangup()
        }
      })
    },
    methods: {
      sendMessage (message) {
        console.log('Client sending message: ', message)
        socket.emit('message', {
          room: this.roomId,
          message
        })
      },
      gotStream (stream) {
        console.log('Adding local stream.')
        this.localStream = stream
        this.localVideo.srcObject = stream
        this.sendMessage('got user media')
        console.log('is Init', this.isInitiator)
        if (this.isInitiator) {
          this.maybeStart()
        }
      },
      maybeStart () {
        console.log('>>>>>>> maybeStart() ', this.isStarted, this.localStream, this.isChannelReady)
        if (!this.isStarted && typeof this.localStream !== 'undefined' && this.isChannelReady) {
          console.log('>>>>>> creating peer connection')
          this.createPeerConnection()
          this.pc.addStream(this.localStream)
          this.isStarted = true
          console.log('isInitiator', this.isInitiator)
          if (this.isInitiator) {
            this.doCall()
          }
        }
      },
      createPeerConnection () {
        try {
          this.pc = new RTCPeerConnection(null)
          this.pc.onicecandidate = this.handleIceCandidate
          this.pc.onaddstream = this.handleRemoteStreamAdded
          this.pc.onremovestream = this.handleRemoteStreamRemoved
          console.log('Created RTCPeerConnnection')
        } catch (e) {
          console.log('Failed to create PeerConnection, exception: ' + e.message)
          alert('Cannot create RTCPeerConnection object.')
        }
      },
      handleIceCandidate (event) {
        console.log('icecandidate event: ', event)
        if (event.candidate) {
          this.sendMessage({
            type: 'candidate',
            label: event.candidate.sdpMLineIndex,
            id: event.candidate.sdpMid,
            candidate: event.candidate.candidate
          })
        } else {
          console.log('End of candidates.')
          this.isStarted = false
        }
      },

      handleCreateOfferError (event) {
        console.log('createOffer() error: ', event)
      },

      doCall () {
        console.log('Sending offer to peer')
        this.pc.createOffer(this.setLocalAndSendMessage, this.handleCreateOfferError)
      },

      doAnswer () {
        console.log('Sending answer to peer.')
        this.pc.createAnswer().then(
          this.setLocalAndSendMessage,
          this.onCreateSessionDescriptionError
        )
      },

      setLocalAndSendMessage (sessionDescription) {
        this.pc.setLocalDescription(sessionDescription)
        console.log('setLocalAndSendMessage sending message', sessionDescription)
        this.sendMessage(sessionDescription)
      },

      onCreateSessionDescriptionError (error) {
        console.log('Failed to create session description: ' + error.toString())
      },

      handleRemoteStreamAdded (event) {
        console.log('Remote stream added.')
        this.remoteStream = event.stream
        this.remoteVideo.srcObject = this.remoteStream
      },

      handleRemoteStreamRemoved (event) {
        console.log('Remote stream removed. Event: ', event)
      },

      hangup () {
        console.log('Hanging up.')
        stop()
        this.sendMessage('bye')
      },

      handleRemoteHangup () {
        console.log('Session terminated.')
        stop()
        this.isInitiator = false
      },

      stop () {
        this.isStarted = false
        this.pc.close()
        this.pc = null
      }
    }
  }
</script>

<style scoped>

  video {
    position: absolute;
  }

  #user-feedback {
    z-index: 3;
    width: 36%;
    height: 30%;
    right: 0;
    top: 0;
    border: solid;
    background: black;
  }

  #user-call {
    z-index: 2;
    min-height: 100%;
    min-width: 100%;
    height: auto;
    width: auto;
    left: 50%;
    transform: translateX(-50%);
    background: #2c3e50;

  }

  #call {
    height: 100%;
    position: relative;
  }
</style>
