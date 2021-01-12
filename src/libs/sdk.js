import AgoraRtcEngine from 'agora-electron-sdk'
import { EventEmitter } from 'events';
import { wait, CustomBtoa } from './util'
import os from 'os'
import path from 'path';
import { SHARE_ID } from '../config/config'

class SDK {
  constructor(options) {
    this.appId = options.appId
    this.logPath = options.logPath
    this.role = options.role
    this.joined = false
    this.videoMuted = false
    this.audioMuted = false
    this.localUid = 0
    this.appId = options.appId
    this.subscribedList = []

    this.client = new AgoraRtcEngine()
    let ret = this.client.initialize(this.appId)
    if (ret < 0) {
      throw {
        message: `AgoraRtcEngine initialize with APPID: ${this.appId} failured`,
        code: ret
      }
    }

    this.client.setChannelProfile(1)
    this.client.enableVideo()
    this.client.enableAudio()
    this.client.enableWebSdkInteroperability(true)
    this.client.enableAudioVolumeIndication(1000, 3, true)
    this.client.setVideoProfile(43, false);
    this.client.setClientRole(options.role === undefined ? 2: options.role)

    if (this.logPath) {
      console.log(`[electron-log-path] set logPath: ${this.logPath}`)
      this.client.setLogFile(this.logPath)
    }
    this.bus = new EventEmitter()

    this.init()
  }

  fire(eventName, ...args) {
    // console.info(eventName, ...args)
    console.log(eventName)
    this.bus.emit(eventName, ...args)
  }

  on(eventName, cb) {
    this.bus.on(eventName, cb)
  }
  init() {
    this.client.on('error', (err) => {
      this.fire('exception', err)
    })

    this.client.on('groupAudioVolumeIndication', (speakers, speakerNumber, totalVolume) => {
      this.fire('volume-indication', {
        speakers, speakerNumber, totalVolume
      })
    })

    this.client.on('clientRoleChanged', (oldRole, newRole) => {
      this.fire('role-changed', {
        oldRole, newRole
      })
    })

    this.client.on('userjoined', (uid) => {
      this.fire('user-published', {
        uid
      })
    })

    this.client.on('removestream', (uid) => {
      console.log(`removestream ${uid}`)
      this.fire('user-unpublished', {
        uid
      })
    })

    this.client.on('connectionStateChanged', (state, reason) => {
      this.fire('connection-state-change', {
        curState: state,
        reason
      })
    })

    this.client.on('networkquality', (...args) => {
      console.log("network-quality, uid: ", args[0], " downlinkNetworkQuality: ", args[1], " uplinkNetworkQuality ", args[2])
      this.fire('network-quality', {
        downlinkNetworkQuality: args[1],
        uplinkNetworkQuality: args[2]
      })
    })

    this.client.on('remoteVideoStateChanged', (uid, state, reason) => {
      console.log('remoteVideoStateChanged ', reason, uid)
      if (reason === 5) {
        this.fire('user-unpublished', {
          uid,
          mediaType: 'video',
        })
      }

      if (reason === 6) {
        this.fire('user-published', {
          uid,
          mediaType: 'video',
        })
      }
    })

    this.client.on('remoteAudioStateChanged', (uid, state, reason) => {
      console.log('remoteAudioStateChanged ', reason, uid)

      // remote user disable audio
      // if (reason === 5) {
      //   this.fire('user-unpublished', {
      //     uid,
      //     mediaType: 'audio',
      //   })
      // }
    })

    this.client.on('joinedchannel', (channel, uid) => {
      console.info('joinedchannel', channel, uid)
      this.fire('joined-channel', {
        uid,
        channel
      })
    })

    this.client.on('localVideoStateChanged', (state, error) => {
      this.fire('user-info-updated', {
        uid: this.localUid,
        state,
        type: 'video',
        msg: error
      })
    })

    this.client.on('localAudioStateChanged', (state, error) => {
      this.fire('user-info-updated', {
        uid: this.localUid,
        state,
        type: 'audio',
        msg: error
      })
    })

    this.client.on('tokenPrivilegeWillExpire', () => {
      this.fire('token-privilege-will-expire')
    })

    this.client.on('tokenPrivilegeDidExpire', () => {
      this.fire('token-privilege-did-expire')
    })

    this.client.on('localPublishFallbackToAudioOnly', (isFallbackOrRecover) => {
      this.fire('stream-fallback', {
        uid: this.localUid,
        isFallbackOrRecover
      })
    })

    this.client.on('remoteSubscribeFallbackToAudioOnly', (uid, isFallbackOrRecover) => {
      this.fire('stream-fallback', {
        uid,
        isFallbackOrRecover
      })
    })
    this.client.on('rtcStats', (evt) => {
      this.fire('rtcStats', evt)
    })

  }

  async join(token, channel, info, uid) {
    let ret = this.client.joinChannel(token, channel, info, uid)
    if (ret < 0) {
      throw {
        message: `joinChannel failure`,
        code: ret
      }
    }
    this.localUid = uid
    this.joined = true;
    return
  }

  async leave() {
    let ret = this.client.setClientRole(2)
    if (ret < 0) {
      throw {
        message: `setClientRole failure`,
        code: ret
      }
    }
    ret = this.client.leaveChannel()
    if (ret < 0) {
      throw {
        message: `leaveChannel failure`,
        code: ret
      }
    }
    this.reset()
    return
  }

  async release() {
    let ret = this.client.release()
    if (ret < 0) {
      throw {
        message: 'release failure',
        code: ret
      }
    }
    this.reset()
  }
  reset () {
    this.role = 2
    this.joined = false
    this.videoMuted = false
    this.audioMuted = false
    this.localUid = undefined
    this.subscribedList = []
    this.bus.removeAllListeners()
  }
  async openCamera(option) {
    let ret = this.client.enableLocalVideo(true)
    if (ret < 0) {
      throw {
        message: `enableLocalVideo failure`,
        code: ret
      }
    }
    if (option) {
      option.deviceId && this.client.setVideoDevice(option.deviceId)
      option.encoderConfig && this.client.setVideoEncoderConfiguration(option.encoderConfig)
    }
    if (this.joined) {
      ret = this.client.muteLocalVideoStream(false)
      console.info("living muteLocalVideoStream, ret: ", ret)
      this.videoMuted = false
    }
  }

  closeCamera() {
    let ret = this.client.enableLocalVideo(false)
    if (ret < 0) {
      throw {
        message: `enableLocalVideo failure`,
        code: ret
      }
    }
    console.info("electron: closeCamera")
    if (this.joined) {
      ret = this.client.muteLocalVideoStream(true)
      this.videoMuted = true
      if (ret < 0) {
        throw {
          message: `enableLocalVideo failure`,
          code: ret
        }
      }
      console.info("electron: muteCamera")
    }
  }

  async changeCamera(deviceId) {
    let ret = this.client.setVideoDevice(deviceId)
    if (ret < 0) {
      throw {
        message: 'changeCamera failure',
        code: ret
      }
    }
  }


  async getMicrophones () {
    const list = this.client.getAudioRecordingDevices();
    const genList = list.map((it) => ({
      deviceId: it.deviceid,
      label: it.devicename,
      kind: 'audioinput'
    }))
    this.microphoneList = genList
    return genList
  }

  async getCameras() {
    const list = this.client.getVideoDevices()
    const genList = list.map((it) => ({
      deviceId: it.deviceid,
      label: it.devicename,
      kind: 'videoinput'
    }))
    this.cameraList = genList
    return genList
  }

  async openMicrophone(option) {
    let ret = this.client.enableLocalAudio(true)
    if (ret < 0) {
      throw {
        message: `enableLocalAudio failure`,
        code: ret
      }
    }
    if (option) {
      option.deviceId && this.client.setAudioRecordingDevice(option.deviceId)
    }
    if (this.joined) {
      ret = this.client.muteLocalAudioStream(false)
      this.audioMuted = false
      console.info("living muteLocalAudioStream, ret: ", ret)
    }
  }

  closeMicrophone() {
    let ret = this.client.enableLocalAudio(false)
    if (ret < 0) {
      throw {
        message: `enableLocalAudio failure`,
        code: ret
      }
    }
    this.client.stopAudioRecordingDeviceTest()
    if (this.joined) {
      ret = this.client.muteLocalAudioStream(true)
      this.audioMuted = true
    }
  }

  async changeMicrophone(deviceId) {
    let ret = this.client.setAudioRecordingDevice(deviceId)
    if (ret < 0) {
      throw {
        message: 'setAudioRecordingDevice failure',
        code: ret
      }
    }
  }
  
  async getShareWindows() {
    let list = this.client.getScreenWindowsInfo();
    return list.map((it) => ({
      ownerName: it.ownerName,
      name: it.name,
      windowId: it.windowId,
      image: CustomBtoa(it.image),
    }))
  }

  async prepareScreenShare(token, channelName, info) {
    return new Promise((resolve, reject) => {
      // if(this.sharingPrepared){
      //   return resolve(this.state.localVideoSource)
      // }
      let timer = setTimeout(() => {
        reject(new Error('Timeout'))
      }, 10000)
      let rtcEngine = this.client
      rtcEngine.once('videosourcejoinedsuccess', uid => {
        clearTimeout(timer)
        // this.sharingPrepared = true
        resolve(uid)
      });
      try {
        rtcEngine.videoSourceInitialize(this.appId);
        let logpath = path.resolve(os.homedir(), "./agorascreenshare.log")
        console.log('logpath.', logpath)
        rtcEngine.videoSourceSetLogFile(logpath)
        rtcEngine.videoSourceSetChannelProfile(1);
        rtcEngine.videoSourceEnableWebSdkInteroperability(true)
        // to adjust render dimension to optimize performance
        rtcEngine.setVideoRenderDimension(3, SHARE_ID + this.localUid, 1200, 680);

        // rtcEngine.videoSourceSetEncryptionSecret("hello")
        // rtcEngine.videoSourceSetEncryptionMode("aes-128-xts")
        
        // rtcEngine.videoSourceEnableEncryption(true, {encryptionMode: 1, encryptionKey: "hello"});
        rtcEngine.videoSourceJoin(token, channelName, info, SHARE_ID + this.localUid);
      } catch(err) {
        clearTimeout(timer)
        reject(err)
      }
    })
  }

  startScreenShare(windowId = 0) {
    // if(!this.sharingPrepared) {
    //   console.error('Sharing not prepared yet.')
    //   return false
    // };
    return new Promise((resolve, reject) => {
      let rtcEngine = this.client
      try {
        // rtcEngine.startScreenCapture2(windowId, captureFreq, rect, bitrate);
        // there's a known limitation that, videosourcesetvideoprofile has to be called at least once
        // note although it's called, it's not taking any effect, to control the screenshare dimension, use captureParam instead
        rtcEngine.videoSourceSetVideoProfile(43, false);
        rtcEngine.videoSourceStartScreenCaptureByWindow(windowId, {x: 0, y: 0, width: 0, height: 0}, {width: 0, height: 0, bitrate: 500, frameRate: 15, captureMouseCursor: false, windowFocus: false})
        rtcEngine.startScreenCapturePreview();
        resolve()
      } catch(e) {
        reject(e)
      }
    });
  }

  async startScreenShareBank(options) {
    const startScreenPromise = new Promise((resolve, reject) => {
      const config = options.config || {
        profile: 50,
        rect: {x: 0, y: 0, width: 0, height: 0},
        param: {
          width: 0, height: 0, bitrate: 500, frameRate: 15
        }
      }
      try {
        let ret = this.client.videoSourceInitialize(this.appId)
        if (ret < 0) {
          reject({
            message: `videoSourceInitialize with APPID: ${this.appId} failured`,
            code: ret
          })
        }
        this.client.videoSourceSetChannelProfile(1)
        this.client.videoSourceEnableWebSdkInteroperability(true)
        this.client.videoSourceSetVideoProfile(config && config.profile ? config.profile : 50, false)
        console.log(`[electron-log-path] checkout videoSourceLogPath: ${this.videoSourceLogPath}`)
        if (this.videoSourceLogPath) {
          this.client.videoSourceSetLogFile(this.videoSourceLogPath)
          //@ts-ignore
          window.setNodeAddonVideoSourceLogPath = this.videoSourceLogPath
          console.log(`[electron-log-path] set videoSourceLogPath: ${this.videoSourceLogPath}`)
        }
        const handleVideoSourceJoin = (uid) => {
          this.client.off('videoSourceJoinedSuccess', handleVideoSourceJoin)
          console.info("startScreenShare#options uid, ", uid, "  options", options, config)
          this.client.videoSourceSetVideoProfile(43, false);
          // this.client.videoSourceStartScreenCaptureByWindow(parseInt(options.windowId), {x: 0, y: 0, width: 0, height: 0}, {width: 0, height: 0, bitrate: 500, frameRate: 15})
          this.client.videoSourceStartScreenCaptureByScreen(options.displayId, {x: 0, y: 0, width: 0, height: 0}, {width: 0, height: 0, bitrate: 500, frameRate: 5})
          // this.client.setupLocalVideoSource(dom)
          this.client.startScreenCapturePreview()
          resolve(uid)
        }
        this.client.on('videoSourceJoinedSuccess', handleVideoSourceJoin)
        const params = options.params
        ret = this.client.videoSourceJoin(params.token, params.channel, params.joinInfo ? params.joinInfo : '', params.uid)
        if (ret < 0) {
          this.client.off('videoSourceJoinedSuccess', handleVideoSourceJoin)
          reject({
            message: 'videoSourceJoin failure',
            code: ret
          })
        }
      } catch (err) {
        this.client.off('videoSourceJoinedSuccess', () => {})
        reject(err)
      }
    })

    return await Promise.race([startScreenPromise, wait(8000)])
  }

  async stopScreenShare() {
    let rtcEngine = this.client
    rtcEngine.stopScreenCapture2()
    rtcEngine.videoSourceLeave()
    rtcEngine.videoSourceRelease()
    return true
  }

  async publish(){
    if (this.joined) {
      this.client.setClientRole(1)
    } else {
      console.info("before invoke publish, please join channel first")
    }
  }

  async unpublish() {
    if (this.joined) {
      this.client.setClientRole(2)
    } else {
      console.info("before invoke unpublish, please join channel first")
    }
  }

  async openTestCamera(option) {
    if (this.joined) {
      throw 'electron not support openTestCamera'
    }
    await this.openCamera(option)
  }
  
  closeTestCamera() {
    if (this.joined) {
      throw 'electron not support closeTestCamera'
    }
    this.closeCamera()
  }
  
  async changeTestCamera(deviceId) {
    if (this.joined) {
      throw 'electron not support changeTestCamera'
    }
    await this.changeCamera(deviceId)
  }
  
  async openTestMicrophone(option) {
    if (this.joined) {
      throw 'electron not support openTestMicrophone'
    }
    await this.openMicrophone(option)
    this.client.startAudioRecordingDeviceTest(300)
  }
  
  async changeTestResolution(config) {
    if (this.joined) {
      throw 'electron not support changeTestResolution'
    }
    await this.changeResolution(config)
  }
  
  closeTestMicrophone() {
    if (this.joined) {
      throw 'electron not support closeTestMicrophone'
    }
    this.closeMicrophone()
  }
  
  async changeTestMicrophone(deviceId) {
    if (this.joined) {
      throw 'electron not support changeTestMicrophone'
    }
    await this.changeMicrophone(deviceId)
  }
}

export default SDK