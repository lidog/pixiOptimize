import { Graphics, Container, Text } from 'pixi.js'

class Map extends Graphics {
  constructor(scale, draggable = false, layers = []) {
    super()
    this.draggable = draggable
    this.layers = layers
    this.scale = scale ? scale : 1
    // this.blend = null//this.drawPoly(json)
    // this.stand = null
    // this.holdingPoint = null
  }

  // 获取图层样式
  getLayerStyle(featureType) {
    let lineStyle = {}
    let fillStyle = {}
    let textStyle = {}

    switch (featureType) {
      case '0':
        lineStyle = DEFAULT_LAYER_STYLE.POLYGON_RUNWAY.lineStyle//{width: 4, color: 0xff0000, alpha: 0}
        fillStyle = DEFAULT_LAYER_STYLE.POLYGON_RUNWAY.fillStyle//{color: 0x000000, alpha: 1}
        break
      // case '3':
      //   // TODO
      //   lineStyle = DEFAULT_LAYER_STYLE.POLYGON_SERVICE_ROAD.lineStyle//{width: 2, color: 0x000000, alpha: 0}
      //   fillStyle = DEFAULT_LAYER_STYLE.POLYGON_SERVICE_ROAD.fillStyle//{color: 0xc0c0c0, alpha: 1}
      //   break
      // case '7':
      // lineStyle = DEFAULT_LAYER_STYLE.POLYGON_RUNWAY_SHOULDER.lineStyle//{width: 2, color: 0x000000, alpha: 0}
      // fillStyle = DEFAULT_LAYER_STYLE.POLYGON_RUNWAY_SHOULDER.fillStyle//{color: 0xc0c0c0, alpha: 1}
      //   break
      case '14':
        lineStyle = DEFAULT_LAYER_STYLE.POLYGON_TAXIWAY.lineStyle//{width: 2, color: 0x000000, alpha: 0}
        fillStyle = DEFAULT_LAYER_STYLE.POLYGON_TAXIWAY.fillStyle//{color: 0xc0c0c0, alpha: 1}
        break
      // case '15':
      //   lineStyle = DEFAULT_LAYER_STYLE.POLYGON_TAXIWAY_SHOULDER.lineStyle//{width: 2, color: 0x000000, alpha: 0}
      //   fillStyle = DEFAULT_LAYER_STYLE.POLYGON_TAXIWAY_SHOULDER.fillStyle//{color: 0xA8A8A8, alpha: 1}
      //   break
      case '17':
        lineStyle = DEFAULT_LAYER_STYLE.LINE_MIDDLE_WAIT.lineStyle//{width: 2, color: 0xDBDBDB, alpha: 0.0}
        break
      case '18':
        lineStyle = DEFAULT_LAYER_STYLE.LINE_RUNWAY_HOLDING_POSITION.lineStyle//{width: 2, color: 0xDBDBDB, alpha: 0.0}
        break
      case '21':
        lineStyle = DEFAULT_LAYER_STYLE.POLYGON_STAND_APRON.lineStyle//{width: 2, color: 0xDBDBDB, alpha: 0.0}
        fillStyle = DEFAULT_LAYER_STYLE.POLYGON_STAND_APRON.fillStyle//{color: 0xDBDBDB, alpha: 1}
        break
      case '24':
        lineStyle = DEFAULT_LAYER_STYLE.POLYGON_STAND.lineStyle
        fillStyle = DEFAULT_LAYER_STYLE.POLYGON_STAND.fillStyle
        break
      case '27':
        lineStyle = DEFAULT_LAYER_STYLE.POLYGON_VERTICAL_STRUCTURE.lineStyle//{width: 2, color: 0x000000, alpha: 0}
        fillStyle = DEFAULT_LAYER_STYLE.POLYGON_VERTICAL_STRUCTURE.fillStyle//{color: 0x757575, alpha: 1}
        break
      // case '34':
      //   lineStyle = DEFAULT_LAYER_STYLE.POLYGON_SERVICE_ROAD.lineStyle//{width: 2, color: 0xaeaeae, alpha: 1}
      //   fillStyle = DEFAULT_LAYER_STYLE.POLYGON_SERVICE_ROAD.fillStyle//{color: 0x000000, alpha: 0}
      //   break
      case '39':
        lineStyle = DEFAULT_LAYER_STYLE.LINE_ASRN.lineStyle//{width: 2, color: 0xffff00, alpha: 1}
        fillStyle = DEFAULT_LAYER_STYLE.LINE_ASRN.fillStyle//{color: 0x000000, alpha: 0}
        break
      case '45':
        lineStyle = DEFAULT_LAYER_STYLE.LINE_APPROACH_HEAD_RUNWAY.lineStyle
        break
      case '60':
        textStyle = DEFAULT_LAYER_STYLE.TEXT_TAXIWAY
        break
      case '61':
        textStyle = DEFAULT_LAYER_STYLE.TEXT_STAND
        break
      case '66':
        lineStyle = DEFAULT_LAYER_STYLE.POLYGON_SECTOR.lineStyle
        fillStyle = DEFAULT_LAYER_STYLE.POLYGON_SECTOR.fillStyle
        break
      default:
        lineStyle = DEFAULT_LAYER_STYLE.DEFAULT.lineStyle
        fillStyle = DEFAULT_LAYER_STYLE.DEFAULT.fillStyle
        break
    }

    return [lineStyle, fillStyle, textStyle]
  }
  // 绘制图形（地图图层）
  drawPoly(json) {
    let featuresArr = json.features

    let poly = new Graphics()

    for (let i = 0; i < featuresArr.length; ++i) {
      let featureObj = featuresArr[i]
      let properties = featureObj.properties
      let featureType = properties.featureType
      let featureCoor = featureObj.geometry.coordinates

      let styleArr = this.getLayerStyle(featureType)
      let lineStyle = styleArr[0]
      let fillStyle = styleArr[1]

      switch (featureObj.geometry.type) {
        case 'Polygon':
          this.drawGeoPolygon(poly, featureCoor, lineStyle, fillStyle)
          break
        case 'MultiPolygon':
          this.drawGeoMultiPolygon(poly, featureCoor, lineStyle, fillStyle)
          break
        case 'LineString':
          this.drawGeoLineString(poly, featureCoor, lineStyle)
          break
        default:
          break
      }
    }

    return poly
  }
  drawGeoPolygon(poly, coordinates, lineStyle, fillStyle) {
    for (let len = coordinates.length, k = 0; k < len; k++) {
      let oriAry = coordinates[k]
      let tmAry = []

      for (let j = 0; j < oriAry.length; ++j) {
        tmAry.push(oriAry[j][0])
        tmAry.push(oriAry[j][1])
      }
      
      poly.lineStyle(lineStyle)
      poly.beginFill(fillStyle.color, fillStyle.alpha)
      if (k > 0) {
        poly.beginHole()
      }
      poly.drawPolygon(tmAry)
      if (k > 0) {
        poly.endHole()
      }
      poly.endFill()
    }

    return poly
  }
  drawGeoMultiPolygon(poly, coordinates, lineStyle, fillStyle) {
    for (let l = 0, len = coordinates.length; l < len; l++) {
      for (let k = 0; k < coordinates[l].length; k++) {
        let oriAry = coordinates[l][k]
        let tmAry = []

        for (let j = 0; j < oriAry.length; ++j) {
          tmAry.push(oriAry[j][0])
          tmAry.push(oriAry[j][1])
        }

        poly.lineStyle(lineStyle)
        poly.beginFill(fillStyle.color, fillStyle.alpha)
        if (k > 0) {
          poly.beginHole()
        }
        poly.drawPolygon(tmAry)
        if (k > 0) {
          poly.endHole()
        }
        poly.endFill()
      }
    }

    return poly
  }
  drawGeoLineString(poly, coordinates, lineStyle) {
    poly.lineStyle(lineStyle)
    for (let j = 0, len = coordinates.length; j < len; j++) {
      if (j > 0) {
        poly.lineTo(coordinates[j][0], coordinates[j][1])
      } else {
        poly.moveTo(coordinates[j][0], coordinates[j][1])
      }
    }

    return poly
  }
  // 绘制跑道号
  drawRunwayCode() {
    const textRunwayContainer = new Container()
    for (let len = RUNWAY_CODE_INFO.length, i = 0; i < len; i++) {
      const basicText = new Text(RUNWAY_CODE_INFO[i].RunwayCode, DEFAULT_LAYER_STYLE.TEXT_RUNWAY)
      basicText.x = RUNWAY_CODE_INFO[i].coordinates[0]
      basicText.y = RUNWAY_CODE_INFO[i].coordinates[1]
      basicText.scale.set(1, -1)
      basicText.angle = 166 + 180
      basicText.pivot.set(basicText.width / 2, basicText.height / 2)

      textRunwayContainer.addChild(basicText)
    }

    textRunwayContainer.name = 'textRunway'

    return textRunwayContainer
  }
  // 绘制文字（停机位编号、滑行道编号）
  drawText(json) {
    let featuresArr = json.features
    let textContainer = new Container()

    for (let i = 0; i < featuresArr.length; ++i) {
      let featureObj = featuresArr[i]
      let properties = featureObj.properties
      let featureType = properties.featureType
      let featureCoor = featureObj.geometry.coordinates

      let styleArr = this.getLayerStyle(featureType)
      let textStyle = styleArr[2]

      let basicText = new Text(properties.text, textStyle)
      basicText.x = featureCoor[0]
      basicText.y = featureCoor[1]
      basicText.scale.set(1, -1)
      basicText.pivot.set(basicText.width / 2, basicText.height / 2)

      // let texture = app.renderer.generateTexture(basicText)
      // let sprite = new PIXI.Sprite(texture)

      textContainer.addChild(basicText)
    }

    return textContainer
  }
  // 更新停机位状态
  updateStand(poly, features) {
    if(poly){
      poly.clear()
    }
    
    for (let i = 0, len = features.length; i < len; i++) {
      let featureObj = features[i]
      let coordinates = featureObj.geometry.coordinates
      let status = featureObj.properties.status
      let lineStyle, fillStyle
      
      switch (status) {
        case 0:
          lineStyle = STAND_STATUS_STYLE.STAND_CLOSE.lineStyle
          fillStyle = STAND_STATUS_STYLE.STAND_CLOSE.fillStyle
          break
        case 1:
          lineStyle = STAND_STATUS_STYLE.STAND_OCCUPY.lineStyle
          fillStyle = STAND_STATUS_STYLE.STAND_OCCUPY.fillStyle
          break
        case 2:
          lineStyle = STAND_STATUS_STYLE.STAND_IDLE.lineStyle
          fillStyle = STAND_STATUS_STYLE.STAND_IDLE.fillStyle
          break
        case 3:
          lineStyle = STAND_STATUS_STYLE.STAND_PUSH.lineStyle
          fillStyle = STAND_STATUS_STYLE.STAND_PUSH.fillStyle
          break
        // case 2:
        default:
          lineStyle = DEFAULT_LAYER_STYLE.POLYGON_STAND.lineStyle
          fillStyle = DEFAULT_LAYER_STYLE.POLYGON_STAND.fillStyle
          break
      }
      this.drawGeoPolygon(poly, coordinates, lineStyle, fillStyle)
    }

    return poly
  }
  // 更新等待线状态
  updateWaitLine(poly, features) {
    poly.clear()
    for (let i = 0, len = features.length; i < len; i++) {
      let featureObj = features[i]
      let coordinates = featureObj.geometry.coordinates
      let status = featureObj.properties.status
      let lineStyle = DEFAULT_LAYER_STYLE.LINE_RUNWAY_HOLDING_POSITION.lineStyle

      switch (status) {
        case 1:
          lineStyle.alpha = 0
          break
        case 0:
        default:
          break
      }

      this.drawGeoLineString(poly, coordinates, lineStyle)
    }

    return poly
  }
  // 更新跑道状态
  updateRunway(poly, features) {
    poly.clear()
    for (let i = 0, len = features.length; i < len; i++) {
      let featureObj = features[i]
      let coordinates = featureObj.geometry.coordinates
      let status = featureObj.properties.status
      let lineStyle, fillStyle
      
      switch (status) {
        case 0:
          lineStyle = RUNWAY_STATUS_STYLE.RUNWAY_CLOSE.lineStyle
          fillStyle = RUNWAY_STATUS_STYLE.RUNWAY_CLOSE.fillStyle
          break
        case 1:
          lineStyle = RUNWAY_STATUS_STYLE.RUNWAY_OCCUPY.lineStyle
          fillStyle = RUNWAY_STATUS_STYLE.RUNWAY_OCCUPY.fillStyle
          break
        case 2:
          lineStyle = RUNWAY_STATUS_STYLE.RUNWAY_OPEN.lineStyle
          fillStyle = RUNWAY_STATUS_STYLE.RUNWAY_OPEN.fillStyle
          break
        case 3:
          lineStyle = RUNWAY_STATUS_STYLE.RUNWAY_CONFILICT.lineStyle
          fillStyle = RUNWAY_STATUS_STYLE.RUNWAY_CONFILICT.fillStyle
          break
        // case 2:
        default:
          lineStyle = DEFAULT_LAYER_STYLE.POLYGON_RUNWAY.lineStyle
          fillStyle = DEFAULT_LAYER_STYLE.POLYGON_RUNWAY.fillStyle
          break
      }
      
      this.drawGeoPolygon(poly, coordinates, lineStyle, fillStyle)
    }

    return poly
  }
  // 更新席位扇区
  updateSector(poly, features) {
    poly.clear()
    for (let i = 0, len = features.length; i < len; i++) {
      let featureObj = features[i]
      let coordinates = featureObj.geometry.coordinates
      let inPosition = featureObj.properties.InPosition
      let lineStyle = DEFAULT_LAYER_STYLE.POLYGON_SECTOR.lineStyle
      let fillStyle = DEFAULT_LAYER_STYLE.POLYGON_SECTOR.fillStyle
      
      if(inPosition === 0){
        this.drawGeoPolygon(poly, coordinates, lineStyle, fillStyle)
      }    
    }

    return poly
  }
}

const DEFAULT_LAYER_STYLE = {
  TEXT_STAND: {
    fontFamily: 'Arial',
    fontSize: 18,
    fill: '#FFFFFF',
    stroke: '#000000',
    strokeThickness: 3
  },
  TEXT_TAXIWAY: {
    fontFamily: 'Arial',
    fontSize: '36px',
    fill: '#FFFFFF',
    stroke: '#000000',
    strokeThickness: 3
  },
  TEXT_RUNWAY: {
    fontFamily: 'Bahnschrift-Bold',
    fontSize: '36px',
    fill: '#000000',
    stroke: '#000000',
    strokeThickness: 3
  },
  // TODO
  POLYGON_CONSTRUCTION: {
    lineStyle: { width: 2, color: 0xDBDBDB, alpha: 0.0 },
    fillStyle: { color: 0xDBDBDB, alpha: 1 }
  },
  // TODO
  POINT_ASRN: {
    lineStyle: { width: 2, color: 0xDBDBDB, alpha: 0.0 },
    fillStyle: { color: 0xDBDBDB, alpha: 1 }
  },
  // TODO
  POINT_STAND: {
    lineStyle: { width: 2, color: 0xDBDBDB, alpha: 0.0 },
    fillStyle: { color: 0xDBDBDB, alpha: 1 }
  },
  // TODO
  POINT_VERTICAL_LAMP: {
    lineStyle: { width: 2, color: 0xDBDBDB, alpha: 0.0 },
    fillStyle: { color: 0xDBDBDB, alpha: 1 }
  },
  // TODO
  POINT_BASE: {
    lineStyle: { width: 2, color: 0xDBDBDB, alpha: 0.0 },
    fillStyle: { color: 0xDBDBDB, alpha: 1 }
  },
  // TODO
  POINT_RUNWAY_ENTRANCE: {
    lineStyle: { width: 2, color: 0xDBDBDB, alpha: 0.0 },
    fillStyle: { color: 0xDBDBDB, alpha: 1 }
  },
  LINE_ASRN: {
    lineStyle: { width: 2, color: 0x595959, alpha: 1 }
  },
  // TODO
  LINE_MIDDLE_WAIT: {
    lineStyle: { width: 2, color: 0xFFFF00, alpha: 1.0 }
  },
  // TODO
  LINE_APPROACH_GUIDE_LINE: {
    lineStyle: { width: 2, color: 0xDBDBDB, alpha: 0.0 }
  },
  // TODO
  LINE_RUNWAY_HOLDING_POSITION: {
    lineStyle: { width: 4, color: 0xD33249, alpha: 1.0 }
  },
  LINE_APPROACH_HEAD_RUNWAY: {
    lineStyle: { width: 2, color: 0x000000, alpha: 1.0 }
  },
  POLYGON_HOTSPOT: {
    lineStyle: { width: 2, color: 0xDBDBDB, alpha: 0.0 },
    fillStyle: { color: 0xDBDBDB, alpha: 1 }
  },
  POLYGON_STAND: {
    lineStyle: { width: 2, color: 0x595959, alpha: 1 },
    fillStyle: { color: 0x000000, alpha: 0 }
  },
  POLYGON_STAND_APRON: {
    lineStyle: { width: 2, color: 0xdbdbdb, alpha: 0.0 },
    fillStyle: { color: 0x008F8F8F, alpha: 1 }
  },
  POLYGON_VERTICAL_STRUCTURE: {
    lineStyle: { width: 2, color: 0x454545, alpha: 1 },
    fillStyle: { color: 0x757575, alpha: 0 }
  },
  POLYGON_SERVICE_ROAD: {
    lineStyle: { width: 2, color: 0xaeaeae, alpha: 1 },
    fillStyle: { color: 0x000000, alpha: 0 }
  },
  POLYGON_TAXIWAY: {
    lineStyle: { width: 2, color: 0xFF454545, alpha: 0 },
    fillStyle: { color: 0xFF454545, alpha: 1 }
  },
  POLYGON_TAXIWAY_SHOULDER: {
    lineStyle: { width: 2, color: 0x000000, alpha: 0 },
    fillStyle: { color: 0xA8A8A8, alpha: 1 }
  },
  POLYGON_RUNWAY: {
    lineStyle: { width: 4, color: 0x000000, alpha: 1 },
    fillStyle: { color: 0x000000, alpha: 0 }
  },
  POLYGON_RUNWAY_FLAG: {
    lineStyle: { width: 2, color: 0x000000, alpha: 0 },
    fillStyle: { color: 0xffffff, alpha: 1 }
  },
  POLYGON_RUNWAY_SHOULDER: {
    lineStyle: { width: 2, color: 0x000000, alpha: 0 },
    fillStyle: { color: 0xc0c0c0, alpha: 1 }
  },
  // TODO
  POLYGON_BLOWING_RESISTANCE_APRON: {
    lineStyle: { width: 2, color: 0xDBDBDB, alpha: 0.0 },
    fillStyle: { color: 0xDBDBDB, alpha: 1 }
  },
  // TODO
  POLYGON_FREQUENCY_ZONE: {
    lineStyle: { width: 2, color: 0xDBDBDB, alpha: 0.0 },
    fillStyle: { color: 0xDBDBDB, alpha: 1 }
  },
  // 扇区
  POLYGON_SECTOR: {
    lineStyle: { width: 2, color: 0x000000, alpha: 0.0 },
    fillStyle: { color: 0x373D43, alpha: 0.4 }
  },
  DEFAULT: {
    lineStyle: { width: 2, color: 0xffff00, alpha: 1 },
    fillStyle: { color: 0x000000, alpha: 1 }
  }
}

const RUNWAY_CODE_INFO = [
  {
    RunwayCode: '01',
    coordinates: [-2636, -1764]
  },
  {
    RunwayCode: '19',
    coordinates: [-1742, 1811]
  },
  {
    RunwayCode: '02L',
    coordinates: [-404, -1915]
  },
  {
    RunwayCode: '20R',
    coordinates: [538, 1858]
  },
  {
    RunwayCode: '02R',
    coordinates: [-165.58, -2596.5]
  },
  {
    RunwayCode: '20L',
    coordinates: [776, 1184]
  },
]

const STAND_STATUS_STYLE = {
  STAND_CLOSE: {
    lineStyle: { width: 2, color: 0x4B4B4B, alpha: 1.0 },
    fillStyle: { color: 0x4B4B4B, alpha: 1 }
  },
  STAND_OCCUPY: {
    lineStyle: { width: 2, color: 0x4B4B4B, alpha: 1.0 },
    fillStyle: { color: 0x666666, alpha: 1 }
  },
  STAND_IDLE: {
    lineStyle: { width: 2, color: 0x4B4B4B, alpha: 1.0 },
    fillStyle: { color: 0x808080, alpha: 1 }
  },
  STAND_PUSH: {
    lineStyle: { width: 2, color: 0x4B4B4B, alpha: 1.0 },
    fillStyle: { color: 0x8C8C8C, alpha: 1 }
  }
}

const RUNWAY_STATUS_STYLE = {
  RUNWAY_CLOSE: {
    lineStyle: { width: 4, color: 0x000000, alpha: 0.5 },
    fillStyle: { color: 0x000000, alpha: 0.5 }
  },
  RUNWAY_OCCUPY: {
    lineStyle: { width: 4, color: 0xFFFFBF, alpha: 1.0 },
    fillStyle: { color: 0xFFFFBF, alpha: 0 }
  },
  RUNWAY_OPEN: {
    lineStyle: { width: 4, color: 0x000000, alpha: 1.0 },
    fillStyle: { color: 0x000000, alpha: 0 }
  },
  RUNWAY_CONFILICT: {
    lineStyle: { width: 4, color: 0xFF0000, alpha: 0.5 },
    fillStyle: { color: 0xFF0000, alpha: 0.5 }
  }
}

export { Map }