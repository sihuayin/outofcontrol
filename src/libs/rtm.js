import { EventEmitter } from 'events';
import AgoraRTM from 'agora-rtm-sdk'

// const logFilter = ENABLE_LOG ? AgoraRTM.LOG_FILTER_DEBUG : AgoraRTM.LOG_FILTER_OFF;
const logFilter = AgoraRTM.LOG_FILTER_OFF

export default class Rtm {
    constructor() {
        this._bus = new EventEmitter()
        this.localUid = undefined
        this.logged = false
        this.connectionState = "DISCONNECTED"
        this.prevConnectionState = ""
        this.channels = {}
        this._client = undefined
        this._streamList = []
        this._userList = []
    }

    get client() {
        return this._client
    }

    fire(eventName, ...args) {
        // console.info(eventName, ...args)
        console.log(eventName)
        this._bus.emit(eventName, ...args)
    }

    on(eventName, cb) {
        this._bus.on(eventName, cb)
    }

    async login(config) {
        const client = AgoraRTM.createInstance(config.appId, { enableLogUpload: config.uploadLog, logFilter: logFilter})
        client.on('ConnectionStateChanged', (newState, reason) => {
          this.prevConnectionState = this.connectionState
          this.connectionState = newState
          this.fire("ConnectionStateChanged", {newState, reason})
        })
        client.on("MessageFromPeer", (message, peerId, props) => {
          this.fire("MessageFromPeer", {message, peerId, props})
        })
        await client.login({
          uid: config.uid,
          token: config.rtmToken
        })
        this._client = client
    }

    async init(config) {
        const client = AgoraRTM.createInstance(config.appId, { enableLogUpload: config.uploadLog, logFilter: logFilter})
        let channel = null;
        console.log('[rtm]  wrapper init')
        try {
          client.on('ConnectionStateChanged', (newState, reason) => {
            console.log("[rtm] [Wrapper] ConnectionStateChanged")
            this.prevConnectionState = this.connectionState
            this.connectionState = newState
            this.fire("ConnectionStateChanged", {newState, reason})
          })
          client.on("MessageFromPeer", (message, peerId, props) => {
            console.log("[rtm] [Wrapper] MessageFromPeer")
            this.fire("MessageFromPeer", {message, peerId, props})
          })
          console.log('config', config)
          await client.login({uid: config.uid, token: config.token})
          console.log('watch -> ', client)
          this._client = client
          this.channels[config.channelName] = channel
          this.logged = true
        } catch(err) {
            console.log(err)
          if (client) {
            await client.logout()
          }
          this.reset()
          throw err
        }
      }

    createObserverChannel(channelName) {
        const client = this.client
        return [client.createChannel(channelName), new EventEmitter()]
    }

    async join(channel, bus, config) {

        channel.on('ChannelMessage', (message, memberId, messagePros) => {
        console.log("[rtm] ChannelMessage", message)
        bus
        .emit('ChannelMessage', {
            channelName: config.channelName,
            message,
            memberId,
            messagePros,
        })
        })
        channel.on('MemberJoined', (memberId) => {
        bus
        .emit('MemberJoined', {
            channelName: config.channelName,
            memberId,
        })
        })
        channel.on('MemberLeft', (memberId) => {
        bus.emit('MemberLeft', {
            channelName: config.channelName,
            memberId,
        })
        })
        channel.on('MemberCountUpdated', (memberCount) => {
        bus.emit('MemberCountUpdated', {
            channelName: config.channelName,
            memberCount: memberCount
        })
        })
        await channel.join()
        this.channels[config.channelName] = channel
      }

    async leave(config) {
        const channel = this.channels[config.channelName]
        if (channel) {
            await channel.leave()
            channel.removeAllListeners()
            delete this.channels[config.channelName]
        }
    }

    async destroyRtm() {
        if (this.client) {
            await this.client.logout()
        }
        for (let channelName of Object.keys(this.channels)) {
            if (this.channels[channelName]) {
            this.channels[channelName].removeAllListeners()
            console.log('[rtmWrapper]  removeAllListeners ', channelName)
            this.channels[channelName] = undefined
            }
        }
        this.reset()
    }

    async sendChannelMessage(channelName, message, options) {
        const channel = this.channels[channelName]
        await channel.sendMessage(message, {enableHistoricalMessaging: options.enableHistoricalMessaging})
    }

    async sendPeerMessage(peerId, message, options) {
        let result = await this.client.sendMessageToPeer(message, peerId, {enableHistoricalMessaging: options.enableHistoricalMessaging})
        return result.hasPeerReceived
    }

    release(eventClient) {
        eventClient.removeAllListeners()
        console.log('[rtmWrapper]  eventClient removeAllListeners ')
    }

    resetDataList () {
        this._streamList = []
        this._userList = []
      }
    
    updateStream(stream) {
        const streamIndex = this._streamList.findIndex((t) => t.streamUuid === stream.streamUuid)
        const targetStream = this._streamList[streamIndex]
        if (targetStream && targetStream) {
            this._streamList[streamIndex]
        }
    }

    reset () {
        this.localUid = undefined
        this.logged = false
        this.connectionState = "DISCONNECTED"
        this.prevConnectionState = ""
        this.releaseClient()
        this.releaseChannels()
        this.channels = {}
        if (this.client) {
          this.client.removeAllListeners()
          console.log('[rtmWrapper] removeAllListeners')
        }
        this._client = undefined
        this.removeAllListeners()
        console.log('[rtmWrapper] self removeAllListeners')
        this._streamList = []
        this._userList = []
      }

    releaseChannels() {
        for (let key of Object.keys(this.channels)) {
            if (this.channels[key]) {
            this.release(this.channels[key])
            }
            this.channels[key] = undefined
        }
    }

    releaseClient() {
        this._client && this.release(this._client)
    }
    
}