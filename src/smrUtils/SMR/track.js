import { Container, Graphics, Sprite, Texture, SCALE_MODES, Text } from 'pixi.js'
import { HTMLText } from '@pixi/text-html'
import { MessageBox } from 'element-ui'
// import dayjs from 'dayjs'

class Track {
  constructor(track, app, scale) {
    // super()
    // TO DELETE
    // track.status = 'Arrival'
    this.app = app
    this.scale = scale
    this.track = track
    this.texture = new TrackTexture(this.track.arr_dep, app)
    this.target = this.initTarget()
    this.ensemble = this.initEnsenble()
    this.apparent = APPARENT_STATUS[this.track.arr_dep]
  }

  initTarget () {
    // 目标
    let x = this.track.xPoint
    let y = this.track.yPoint
    const target = new Sprite(this.texture.target)
    target.name = this.track.TrackNumber//callsign
    target.anchor.set(0.5)
    target.position.set(x, y)
    // target.interactive = true
    // target.on('pointerdown', this.toggleTorusControlPanel)
    // target.on('pointerdown', this.toggleRectControlPanel)
    return target
  }

  initEnsenble () {
    let apparent = APPARENT_STATUS[this.track.arr_dep]
    let labelSpec = APPARENT_SPEC[this.track.tagsType]
    let lineStyle = apparent.line.style
    let labelSize = apparent.label.size
    let lineLength = apparent.line.size.length
    let lineAngle = apparent.line.size.angle
    let radius = apparent.target.radius.nor
    let x = this.track.xPoint
    let y = this.track.yPoint
    // let content = this.track.callSign + '  ' + this.track.label.runway + '\n' + this.track.label.aircraft_status
    // *在航班号前：未相关计划 *在航班号后：有路由
    // isHavePlan：是否有相关计划
    const isHavePlanStr = !this.track.isHavePlan ? '*' : ''
    const isHaveRouteStr = this.track.taxiRoute ? '*' : ''
    // 受控标识 :isControlled
    const isControllStr = this.track.isControlled
      ? '<span style="display:inline-block; width: 6px;height: 6px;background-color: #ffffbf; margin-bottom: 7px;margin-left: 2px;"></span>'
      : ''
    // 尾流类型
    const wakeType = this.track.wakeType ? '/' + this.track.wakeType : ''
    // ETOT预计起飞时刻
    // const actTime = dayjs(1671523481).format('YYYY-MM-DD HH:mm:ss')
    // console.log(actTime)
    const actTimeStr = '1926'
    // 全标牌
    const allContent =
      '<span style="width:100px;display:inline-block;">' +
      '<b style="font-size:17px;padding-right:4px">' +
      isHavePlanStr +
      this.track.callSign +
      isHaveRouteStr + '        ' +
      isControllStr +
      '</b>' +
      '</span>' +
      '<span style="width:57px;display:inline-block;text-align: right;">' +
      this.track.mission +
      '      ' +
      '<b>' +
      this.track.runway +
      '</b>' +
      '</span>' +
      '<br>' +
      '<span style="width:60px;display:inline-block;">' +
      this.track.aircraftType +
      wakeType +
      '</span>' +
      '<span style="width:64px;display:inline-block;text-align: center;">' +
      this.track.DestAirport +
      '</span>' +
      '<span style="width:33px;display:inline-block;text-align: right;">' +
      actTimeStr +
      '</span>' +
      '<br>' +
      '<span style="width:130px;display:inline-block;">' +
      this.track.SID +
      '</span>' +
      '<span style="font-weight:bold">' +
      this.track.status +
      '</span>'
    // 简标牌
    const smallContent =
      '<span style="font-weight:bold;font-size:18px;width:105px;display:inline-block;">' +
      isHavePlanStr +
      this.track.callSign +
      isHaveRouteStr + '      ' +
      isControllStr +
      '</span>' +
      '<span style="font-weight:bold;width:50px;display:inline-block;text-align:right">' +
      this.track.runway +
      '</span>' +
      '<br>' +
      '<span style="width:66px;display:inline-block;">' +
      this.track.mission +
      '</span>' +
      '<span style="width:64px;display:inline-block;">' +
      this.track.wakeType +
      '</span>' +
      '<span style="font-weight:bold">' +
      this.track.status +
      '</span>'
    const content = this.track.tagsType === 'simple' ? smallContent : allContent

    // 标牌+引线容器
    const ensemble = new Container()
    ensemble.name = this.track.TrackNumber//callsign
    ensemble.position.set(x + radius, y + radius)
    // 引线
    const line = new Sprite(Texture.WHITE)
    line.tint = lineStyle.color
    line.alpha = lineStyle.alpha
    // line.width = lineLength - labelSize.h / 2 / Math.cos(((360 - lineAngle) * Math.PI) / 180)

    line.width = lineLength
    line.height = lineStyle.width
    line.rotation = lineAngle
    line.position.set(0)
    // 标牌容器
    const label = new Container()
    label.pivot.set(0.5)
    let dd = 0
    let criticalTheta = Math.atan2(
      (labelSpec.h) / 2,
      (labelSize.w) / 2
    )
    if (
      Math.abs(lineAngle) < criticalTheta ||
      Math.abs(lineAngle) > Math.PI - criticalTheta
    ) {
      dd =
        (labelSize.w) /
        2 /
        Math.abs(Math.cos(Math.abs(lineAngle)))
    } else {
      dd =
        (labelSpec.h) /
        2 /
        Math.abs(Math.sin(Math.abs(lineAngle)))
    }
    label.position.set(
      (lineLength + dd) * Math.cos(lineAngle),
      (lineLength + dd) * Math.sin(lineAngle)
    )
    // 标牌-边框
    const rectSprite = new Sprite(this.texture.label)
    rectSprite.height = labelSpec.h

    // 标牌点击事件
    rectSprite.anchor.set(0.5)// !important
    // rectSprite.on('pointerdown', onDragStart, rectSprite)
    rectSprite.position.set(0)
    // rectSprite.scale.set(0.5)
    // 标牌-文本
    const text = new HTMLText(content, {
      fontFamily: 'Bahnschrift',
      fontSize: 14,
      fill: apparent.label.style.text.color,
      lineHeight: 14,
      // stroke: 0x000000,
      // strokeThickness: 1
    })
    text.width = labelSize.w - 3
    // text.height = labelSize.h - 23
    // text.scale.set(1.5, 1)
    text.position.set(
      labelSize.w * 0.005 - labelSize.w / 2,
      labelSpec.h * 0.03 -
      labelSpec.h / 2
    )

    label.name = 'label'
    label.addChild(rectSprite)
    label.addChild(text)
    //场面标牌的Freetext
    const freetext = new HTMLText(
      '<span style="display:inline-block;width:80px;height:16px;">' +
      this.track.freetext +
      '</span>',
      {
        fontFamily: 'Bahnschrift',
        fontSize: 14,
        fill: apparent.label.style.text.color,
        lineHeight: 20
      }
    )
    // freetext.scale.set(1)
    freetext.position.set(
      labelSize.w * 0.005 - labelSize.w / 2,
      labelSpec.h / 2 - 1 * 18 - 4
    )
    freetext.width = 70
    freetext.interactive = true
    freetext.cursor = 'pointer'
    // freetext.on('pointerdown', this.openInputFreeTextDialog)
    // 下拉框
    const selectText = new HTMLText('', {
      fontFamily: 'Bahnschrift',
      fontSize: 14,
      fill: apparent.label.style.text.color,
      lineHeight: 20
    })
    //
    // selectText.text =
    //   '<select onchange="alert(1)"><option value ="">请选择</option><option >GO</option></select>' +
    //   track.foreign
    selectText.text = this.track.isForeignPilots ? 'E' : ''
    selectText.scale.set(1)
    selectText.position.set(
      labelSize.w - 92,
      labelSpec.h / 2 - 1 * 18 - 4
    )
    selectText.interactive = true
    selectText.cursor = 'pointer'
    label.addChild(selectText)
    label.addChild(freetext)
    ensemble.addChild(label)
    ensemble.addChild(line)
    ensemble.scale.set(1 / this.scale, - 1 / this.scale)
    return ensemble
  }

  generateTargetTemplate (status) {
    const templateArr = {}
    const apparent = this.apparent[status]
    // 绘制目标（图片代替？）
    const circle = new Graphics()
    circle.lineStyle(apparent.target.style.border)
    circle.beginFill(apparent.target.style.fill.color, apparent.target.style.fill.alpha)
    circle.drawCircle(0, 0, apparent.target.radius.nor)
    circle.endFill()
    const circleTexture = this.app.renderer.generateTexture(circle, SCALE_MODES.NEAREST, 2)
    // const circleTexture = Texture.from(location.origin + '/round.png')
    // 绘制标牌
    const rect = new Graphics()
    // rect.lineStyle(apparent.label.style.border)
    rect.beginFill(apparent.label.style.fill.color, apparent.label.style.fill.alpha)
    rect.drawRoundedRect(0, 0, apparent.label.size.w, apparent.label.size.h, apparent.label.size.r)
    rect.endFill()
    const rectTexture = this.app.renderer.generateTexture(rect)
    // Scale mode for pixelation
    circleTexture.baseTexture.scaleMode = SCALE_MODES.NEAREST
    rectTexture.baseTexture.scaleMode = SCALE_MODES.NEAREST

    templateArr.target = circleTexture
    templateArr.label = rectTexture
    return templateArr
  }

  generateRec (el) {
    let txt = ''
    switch(el.type) {
      case 'red':
        txt = 'SUP'
        break
      case 'orange':
        txt = 'TUB'
        break
      case 'yellow':
        txt = 'ALT'
        break
    }
    let rec = new Graphics()
    rec.beginFill(el.bgColor, 1)
    rec.drawRoundedRect(0, 0, 38, 20, 2)
    rec.endFill()
    // rec.lineStyle(1, 0xffffff, 1);
    // rec.beginFill(0xF44336, 1)
    // rec.drawCircle(38, 0, 7)
    // rec.endFill()
    const rectTexture = this.app.renderer.generateTexture(rec, SCALE_MODES.NEAREST, 2)
    const recSp = new Sprite(rectTexture)
    const text = new Text(txt, {
      fontFamily: 'Bahnschrift',
      fontSize: 14,
      fill: el.fontColor,
      lineHeight: 12,
      fontWeight: 'bold',
    })
    text.position.set(5, 2)
    el.number = el.number > 9 ? '9+' : el.number
    const text2 = new Text(el.number, {
      fontSize: 11,
      fill: 0xffffff
    })
    text2.position.set(34, 0)
    // recSp.addChild(text, text2)
    recSp.addChild(text)
    return recSp
  }
  // 告警边框
  generateAlertLevelTemplate (label, track) {
    const alramArry = [
      {
        type: 'red',
        number: 1,
        bgColor: 0xF44336,
        fontColor: 0xFFFFFF
      },
      {
        type: 'orange',
        number: 1,
        bgColor: 0xE99C3D,
        fontColor: 0x000000
      },
      {
        type: 'yellow',
        number: 1,
        bgColor: 0xFFEC3A,
        fontColor: 0x000000
      },
    ]
    let trackAlram = track.alarm
    trackAlram.forEach(e => {
      const obj = alramArry.find(element => element.type === e.type)
      e.bgColor = obj ? obj.bgColor : '0xFFEC3A'
      e.fontColor = obj ? obj.fontColor : '0x000000'
    })
    // 绘制告警
    trackAlram.forEach((element, i) => {
      let rec = this.generateRec(element)
      rec.position.set(i * 47 - 81, label.y + 13)
      if (i === 0) {
        let rectBorder = new Graphics()
        rectBorder.lineStyle(1, element.bgColor, 1)
        rectBorder.beginFill(element.bgColor, 0)
        rectBorder.drawRoundedRect(0, 0, label.width, label.height, 2)
        rectBorder.endFill()
        const rectTexture = this.app.renderer.generateTexture(rectBorder, SCALE_MODES.NEAREST, 2)
        const sp = new Sprite(rectTexture)
        sp.name = 'alram_border'
        sp.position.set(-81, label.y + 34)
        label.addChild(sp)
      }
      label.addChild(rec)
    });
  }
  // 自由文本填写
  openInputFreeTextDialog (event) {
    const label = event.target
    const n1 = label.text.indexOf('>') + 1
    const n2 = label.text.indexOf('</')
    MessageBox.prompt('请输入自由文本', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputValue: label.text.substring(n1, n2),
      inputPattern: /^.{1,6}$/,
      inputErrorMessage: '字符串长度在1-6之间',
      modal: false,
    })
      .then(({ value }) => {
        label.text =
          '<span style="display:inline-block;width:80px;height:16px;">' +
          value +
          '</span>'
      })
      .catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入',
        })
      })
  }
  // 获取尾迹点
  getOldPos (track, apparent, targetContainer) {
    // 尾迹点
    for (let i in track.oldPos) {
      let size = 20 - i * 3
      if (size <= 0) {
        size = 1
      }
      const circle = new PIXI.Graphics()
      circle.lineStyle(apparent.target.style.border)
      circle.beginFill(
        apparent.target.style.fill.color,
        apparent.target.style.fill.alpha
      )
      circle.drawCircle(0, 0, size)
      circle.endFill()
      const circleTexture = this.app.renderer.generateTexture(
        circle,
        PIXI.SCALE_MODES.NEAREST,
        2
      )
      const circleSprite = new PIXI.Sprite(circleTexture)
      circleSprite.name = track.TrackNumber + '尾迹点' + i
      circleSprite.anchor.set(0.5)
      circleSprite.position.set(track.oldPos[i][1], track.oldPos[i][0])
      circleSprite.visible = false
      targetContainer.addChild(circleSprite)
    }
  }
}

class TrackTexture {
  constructor(status, app) {
    // super()
    this.status = status
    this.app = app
    this.renderer = this.app.renderer//new Renderer()
    this.target = this.initTargetTexture(status)
    this.label = this.initLabelTexture(status)
  }

  initTargetTexture (status) {
    // if(Texture.from(`target_${status}`)){
    //   return Texture.from(status)
    // } else {
    // 绘制目标（图片代替？）
    const circle = new Graphics()
    let apparent = APPARENT_STATUS[status]
    circle.lineStyle(apparent.target.style.border)
    circle.beginFill(apparent.target.style.fill.color, apparent.target.style.fill.alpha)
    circle.drawCircle(0, 0, apparent.target.radius.nor)
    circle.endFill()
    const circleTexture = this.renderer.generateTexture(circle, SCALE_MODES.NEAREST, 2)
    // const circleTexture = PIXI.Texture.from(location.origin + '/round.png')
    circleTexture.baseTexture.scaleMode = SCALE_MODES.NEAREST
    // Texture.addToCache(circleTexture, `target_${status}`)
    return circleTexture
    // }
  }

  initLabelTexture (status) {
    // if(Texture.from(`label_${status}`)){
    //   return Texture.from(status)
    // } else {
    // 绘制标牌
    const rect = new Graphics()
    let apparent = APPARENT_STATUS[status]
    // rect.lineStyle(apparent.label.style.border)
    rect.beginFill(apparent.label.style.fill.color, apparent.label.style.fill.alpha)
    rect.drawRoundedRect(0, 0, apparent.label.size.w, apparent.label.size.h, apparent.label.size.r)
    rect.endFill()
    const rectTexture = this.renderer.generateTexture(rect)
    rectTexture.baseTexture.scaleMode = SCALE_MODES.NEAREST
    // Texture.addToCache(rectTexture, `label_${status}`)
    return rectTexture
    // }
  }
}

const APPARENT_STATUS = {
  // 离港
  Departure: {
    label: {
      style: {
        fill: { color: 0x121110, alpha: 1 },
        text: { color: 0xFFFF7C },
      },
      size: {
        w: 160,
        h: 75,
        r: 0,
      },
    },
    target: {
      style: {
        border: { width: 4, color: 0xFFFF7C, alpha: 1 },
        fill: { color: 0xFFFF7C, alpha: 0 },
      },
      radius: {
        min: 0,
        nor: 18,
        max: 48,
      },
    },
    line: {
      size: {
        length: 50,
        angle: -Math.PI / 4,
      },
      style: {
        width: 2,
        color: 0xFFFF7C,
        alpha: 1,
      },
    },
  },
  // 进港
  Arrival: {
    label: {
      style: {
        fill: { color: 0x121110, alpha: 1 },
        text: { color: 0x52DBF9 },
      },
      size: {
        w: 160,
        h: 75,
        r: 0,
      },
    },
    target: {
      style: {
        border: { width: 4, color: 0x52DBF9, alpha: 1 },
        fill: { color: 0x52DBF9, alpha: 0 },
      },
      radius: {
        min: 0,
        nor: 18,
        max: 48,
      },
    },
    line: {
      size: {
        length: 50,
        angle: -Math.PI / 4,
      },
      style: {
        width: 2,
        color: 0x52DBF9,
        alpha: 1,
      },
    },
  }
}

const APPARENT_SPEC = {
  whole: {
    w: 160,
    h: 75,
    r: 0,
  },
  simple: {
    w: 160,
    h: 50,
    r: 0,
  },
  extend: {
    w: 160,
    h: 75,
    r: 0,
  },
}

const APPARENT_ALERT = {

}

export { Track }