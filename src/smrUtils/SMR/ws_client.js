import Util from '@/utils/tools'
import Bus from "@/utils/bus";

export class WSClient {
  constructor(url, token = '') {
    this.url = url
    this.protocol = 'ws'
    this.token = token
    this.sector = ''
    this.conn = null
  }

  connect() {
    // this.connectCallback = callback
    let url = `${this.protocol}://${this.url}`
    this.conn = new WebSocket(url)

    this.conn.onopen = () => {
      // console.log('websocket now connected...')
      this.connected = true
      this.onOpen()
    }

    this.conn.onmessage = (event) => {
      // console.log('websocket return message...')
      this.onMessage(event)
    }

    this.conn.onerror = (event) => {
      // console.log('websocket error: ', event)
      this.onError()
    }

    this.conn.onclose = (event) => {
      // console.log('websocket now closed: ', event)
      this.connected = false
      this.onClose()
    }
  }

  close() {
    this.conn.close()
  }

  onOpen() {
    Util.removeLocalData('track')
    this.sendMessage({ type: 'blob' })
  }

  onMessage(event) {
    // console.log('websocket返回数据: ', event.data)
    if (event.data instanceof Blob) {
      // let trackArr = this.resolveBlob(event.data)
      // console.log('trackArr: ', trackArr)
      // console.log('blob: ', event.data)
      let reader = new FileReader()
      reader.readAsText(event.data, 'UTF-8')
      reader.onload = () => {
        let result = JSON.parse(reader.result)
        if (result) {
          // console.log('result: ', result)
          let type = result.type
          if (type) {
            switch (type) {
              case 'track':
                // console.log('reader: ', JSON.parse(reader.result))
                // let userInfo = JSON.parse(Util.getLocalData('userInfo'))
                // let posName = userInfo.posName
                let trackArr = result.TrackData
                let trackSet
                // console.log('trackArr: ', JSON.parse(Util.getLocalData('track')))
                if (!JSON.parse(Util.getLocalData('track'))) {
                  trackSet = {}
                  for (let i = 0, len = trackArr.length; i++; i < len) {
                    let value = trackArr[i]

                    // if(value.PosName === '' || value.PosName === posName){
                    //   value.hasPrivilege = true
                    // }else{
                    //   value.hasPrivilege = false
                    // }

                    let key = value.TrackNumber
                    trackSet[key] = value
                    // console.log('key: ', key)
                  }
                  // console.log('trackSet: ', trackSet)
                } else {
                  // console.log(trackArr,'trackArr')
                  trackSet = JSON.parse(Util.getLocalData('track'))
                  for (let i = 0, len = trackArr.length; i < len; i++) {
                    let track = trackArr[i]

                    // if(track.PosName === '' || track.PosName === posName){
                    //   track.hasPrivilege = true
                    // }else{
                    //   track.hasPrivilege = false
                    // }

                    if (trackSet[track.TrackNumber]) {
                      let trackOld = trackSet[track.TrackNumber]
                      for (let key in track) {
                        let value = track[key]
                        if (trackOld[key] || trackOld[key] != value) {
                          trackOld[key] = value
                        }
                      }
                    } else {
                      trackSet[track.TrackNumber] = track
                    }
                  }
                }
                // console.log('trackSet: ', trackSet)
                Util.saveLocalData('track', JSON.stringify(trackSet))
                break
              case 'Stand':
                // console.log('Stand: ', result)
                // let features = result.Data.features
                // Util.removeLocalData('Stand')
                // Util.saveLocalData('Stand', JSON.stringify(result.Data.features))
                Bus.$emit("Stand", JSON.stringify(result.Data.features))
                break
              case 'WaitLine':
                // console.log('WaitLine: ', result)
                // let features = result.Data.features
                // Util.removeLocalData('WaitLine')
                // Util.saveLocalData('WaitLine', JSON.stringify(result.Data.features))
                // TODO
                Bus.$emit("WaitLine", JSON.stringify(result.Data.features))
                break
              case 'Runway':
                console.log('Runway: ', result)
                Bus.$emit("Runway", JSON.stringify(result.Data.features))
                break
              default:
                break
            }
          }
        }
      }
    } else {
      // let obj = event.data
      // console.log('not blob: ', event.data)
      // if(obj.TrackData && obj.TrackData.length > 0){
      //   // console.log('trackArr: ', obj.TrackData)
      //   if(!Util.getLocalData('track')){
      //     trackData.forEach((track) => {
      //       this.renderSingleIntegratedTarget(track)
      //     })
      //   }  
      //   Util.saveLocalData('track', JSON.stringify(obj.TrackData))
      //   console.log(Util.getLocalData('track'))
      //   const trackData = JSON.parse(Util.getLocalData('track'))            
      // }
    }
  }

  onError() {

  }

  onClose() {
    this.sendMessage({ type: 'close' })
  }

  sendMessage(msg) {
    this.conn.send(JSON.stringify(msg))
  }
}