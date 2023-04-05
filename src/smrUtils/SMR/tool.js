import * as PIXI from 'pixi.js'
import { Ticker } from 'pixi.js'
import head_runway_json from '/public/SMR/target_head_runway_new'
import { DashLine } from 'pixi-dashed-line'

const smrTool = {
  /**
   * 绘制多边形
   * @param coordinates 多边形顶点数组 
   * @param style 样式 
   * @return polygon 返回多边形
   */
  drawPolygon: function (coordinates, style) {
    const polygon = new PIXI.Graphics()

    polygon.beginFill(style.fill.color, style.fill.alpha)
    polygon.lineStyle(style.line)

    for (let len = coordinates.length, i = 0; i < len; i++) {
      if (i === 0) {
        polygon.moveTo(coordinates[i][0], coordinates[i][1])
      } else {
        polygon.lineTo(coordinates[i][0], coordinates[i][1])
      }
    }

    polygon.closePath()
    polygon.endFill()

    return polygon
  },
  /**
   * 绘制线条
   * @param coordinates 线条点数组 
   * @param lineStyle 线条样式 
   * @return line 返回线条图形
   */
  drawLine: function (coordinates, lineStyle) {
    const line = new PIXI.Graphics()
    line.lineStyle(lineStyle)

    for (let len = coordinates.length, i = 0; i < len; i++) {
      if (i === 0) {
        line.moveTo(coordinates[i][0], coordinates[i][1])
      } else {
        line.lineTo(coordinates[i][0], coordinates[i][1])
      }
    }

    // line.scale.set(1, -1)
    return line
  },
  /**
   * 绘制虚线
   * @param x1y1x2y2 线条起始点坐标 
   * @param lineStyle 线条样式 
   * @param dashLength 单线长度 
   * @param spaceLength 线条间隔 
   * @return line 返回线条图形
   */
  drawDashLine: function (x1, y1, x2, y2, lineStyle, dashLength = 20, spaceLength = 10) {
    let x = x2 - x1;
    let y = y2 - y1;
    let hyp = Math.sqrt((x) * (x) + (y) * (y));
    let units = hyp / (dashLength + spaceLength);
    let dashSpaceRatio = dashLength / (dashLength + spaceLength);
    let dashX = (x / units) * dashSpaceRatio;
    let spaceX = (x / units) - dashX;
    let dashY = (y / units) * dashSpaceRatio;
    let spaceY = (y / units) - dashY;
    const dashLine = new PIXI.Graphics()
    dashLine.lineStyle(lineStyle)
    dashLine.moveTo(x1, y1);
    while (hyp > 0) {
      x1 += dashX;
      y1 += dashY;
      hyp -= dashLength;
      if (hyp < 0) {
        x1 = x2;
        y1 = y2;
      }
      dashLine.lineTo(x1, y1);
      x1 += spaceX;
      y1 += spaceY;
      dashLine.moveTo(x1, y1);
      hyp -= spaceLength;
    }
    dashLine.moveTo(x2, y2);

    return dashLine
  },
  /**
   * 绘制虚线圆
   * @param xy 圆心坐标 
   * @param lineStyle 线条样式 
   * @param dashLength 单线长度 
   * @param spaceLength 线条间隔 
   * @return line 返回线条图形
   */
  drawDashCircle: function (x, y, radius, lineStyle, dashAngle = 20, spaceAngle = 10) {
    const dashCircle = new PIXI.Graphics()
    dashCircle.lineStyle(lineStyle)

    let mergeAngle = dashAngle + spaceAngle
    let arcNum = 360 / mergeAngle

    for (let i = 0; i <= arcNum; i++) {
      let startAngle = i * mergeAngle
      dashCircle.arc(x, y, radius, startAngle * Math.PI / 180, (startAngle + dashAngle) * Math.PI / 180);
    }

    return dashCircle
  },
  drawDashedCircle: function (g) {
    const dash = new DashLine(g, {
      dash: [10, 5],
      width: 3,
      color: 0x0000aa,
      useTexture: false,
    })
    dash.drawCircle(-1160, -230, 300)
  },
  /**
   * 绘制多重箭头
   * @param width 宽度 
   * @param angle 角度
   * @param thickness 粗细
   * @param cnt 重复次数
   * @param style 样式 
   * @param position 位置
   * @return arrow (多重)箭头
   */
  drawRepeatArrow: function (width, angle, thickness, cnt, space, style, position) {
    const arrow = new PIXI.Graphics()

    const peakPt = { x: width / 2, y: parseInt(width / 2 / Math.tan(((angle / 2) * Math.PI) / 180)) }
    const ptArr = [
      [
        [0, 0],
        [peakPt.x, peakPt.y],
        [width, 0],
        [width, thickness],
        [peakPt.x, peakPt.y + thickness],
        [0, thickness],
        [0, 0]
      ]
    ]


    for (let i = 0; i < cnt - 1; i++) {
      let newPtArr = []
      for (let j = 0; j < 7; j++) {
        let newPt = []
        newPt.push(ptArr[0][j][0])
        newPt.push(ptArr[0][j][1] + (space + thickness) * (i + 1))
        newPtArr.push(newPt)
      }
      ptArr.push(newPtArr)
    }

    for (let i = 0; i < cnt; i++) {
      let singlePtArr = ptArr[i]
      arrow.beginFill(style.fill.color, style.fill.alpha)
      arrow.lineStyle(style.line)

      for (let len = singlePtArr.length, i = 0; i < len; i++) {
        if (i === 0) {
          arrow.moveTo(singlePtArr[i][0], singlePtArr[i][1])
        } else {
          arrow.lineTo(singlePtArr[i][0], singlePtArr[i][1])
        }
      }

      arrow.closePath()
      arrow.endFill()
    }

    arrow.position.set(position.x, position.y)
    arrow.pivot.set(arrow.width / 2, arrow.height / 2)

    // const arrowTexture = app.renderer.generateTexture(arrow)
    // // Scale mode for pixelation
    // arrowTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST

    // return arrowTexture
    return arrow
  },
  /**
   * 生成双重箭头精灵
   * @param position 位置 
   * @param angle 方向
   * @param size 尺寸(width, height)
   * @param color 颜色(tint)
   * @return sprite 返回图形
   */
  renderDoubleArrow: async function (position, angle, size, color) {
    const dbArrowTexture = await PIXI.Assets.load('/SMR/image/arrow-double.png')
    const dbArrow = PIXI.Sprite.from(dbArrowTexture)

    dbArrow.position.set(position.x, position.y)
    dbArrow.angle = angle
    dbArrow.width = size.width
    dbArrow.height = size.height
    dbArrow.tint = color

    return dbArrow
  },
  /**
   * （一/多个）精灵穿梭动画
   * @param spriteArr 精灵数组 
   * @param routeData 流动路径数据
   * @param space 精灵间隔
   * @param pos 当前路径点位置
   */
  animateSpriteFlow: async function (spriteArr, routeData, space, pos) {
    let routeLen = routeData.length - 1
    let spriteCnt = spriteArr.length
    // 判断传null消失
    if (pos === null) {
      spriteArr.forEach(element => {
        element.visible = false
      });
      return false
    }
    for (let i = 0; i < spriteCnt; i++) {
      if ((pos < space * i + 1) || (pos > routeLen + space * i)) {
        spriteArr[i].visible = false
      } else {
        let spritePos = pos - space * i
        spriteArr[i].visible = true
        spriteArr[i].position.set(routeData[spritePos][0], routeData[spritePos][1])
        spriteArr[i].angle = this.getAngle(routeData[spritePos - 1][0], routeData[spritePos - 1][1], routeData[spritePos][0], routeData[spritePos][1])//routeData[spritePos][2] + 90
      }
    }
  },
  getAngle(x1, y1, x2, y2) {
    let r = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI
    return (r < 0 ? 360 + r : r) //+ 90
  },
  //获取当前utc时间戳
  getUTCTime() {
    let d1 = new Date();
    let d2 = new Date(d1.getUTCFullYear(), d1.getUTCMonth(), d1.getUTCDate(), d1.getUTCHours(), d1.getUTCMinutes(), d1.getUTCSeconds());
    return Date.parse(d2);
  },
  // 初始化箭头动画
  initAccrowAnimate(surface) {
    let controlObj = {
      landAnimate: false,
      lauchAnimate: false,
      enterAnimate: false,
      crossAnimate: false
    }
    let land = this.initAccrow('land')
    let land2 = this.initAccrow('land')
    let land3 = this.initAccrow('land')
    let enter = this.initAccrow('enter')
    let enter2 = this.initAccrow('enter')
    let lauch = this.initAccrow('lauch')
    let lauch2 = this.initAccrow('lauch')
    let lauch3 = this.initAccrow('lauch')
    let cross = this.initAccrow('cross')
    let cross2 = this.initAccrow('cross')
    let pos1 = 1
    let space1 = 7
    let landData = head_runway_json.land
    let landRouteLen = landData.length - 1
    let spriteArr1 = [land, land2, land3]
    let pos2 = 1
    let space2 = 20
    let lauchData = head_runway_json.lauch
    let lauchRouteLen = lauchData.length - 1
    let spriteArr2 = [lauch, lauch2, lauch3]
    let pos3 = 1
    let space3 = 20
    let enterData = head_runway_json.enter
    let enterRouteLen = enterData.length - 1
    let spriteArr3 = [enter, enter2]
    let pos4 = 1
    let space4 = 20
    let crossData = head_runway_json.cross
    let crossRouteLen = crossData.length - 1
    let spriteArr4 = [cross, cross2]
    surface.sortableChildren = true
    surface.addChild(...spriteArr1, ...spriteArr2, ...spriteArr3, ...spriteArr4)
    const ticker = new Ticker()
    ticker.start()
    let tickerCnt = 0
    ticker.add(() => {
      if (tickerCnt > 3) {
        tickerCnt = 0
        // land scene
        this.animateSpriteFlow(
          spriteArr1,
          landData,
          space1,
          controlObj.landAnimate ? pos1 : null
        )
        if (pos1 > landRouteLen + space1 * spriteArr1.length) {
          pos1 = 0
        }
        pos1 += 1
        // lauch scene
        this.animateSpriteFlow(
          spriteArr2,
          lauchData,
          space2,
          controlObj.lauchAnimate ? pos2 : null
        )
        if (pos2 > lauchRouteLen + space2 * spriteArr2.length) {
          pos2 = 0
        }
        pos2 += 1
        // enter scene
        smrTool.animateSpriteFlow(
          spriteArr3,
          enterData,
          space3,
          controlObj.enterAnimate ? pos3 : null
        )
        if (pos3 > enterRouteLen + space3 * spriteArr3.length) {
          pos3 = 0
        }
        pos3 += 1
        // cross scene
        this.animateSpriteFlow(
          spriteArr4,
          crossData,
          space4,
          controlObj.crossAnimate ? pos4 : null
        )
        if (pos4 > crossRouteLen + space4 * spriteArr4.length) {
          pos4 = 0
        }
        pos4 += 1
      }
      tickerCnt++
    })

    return controlObj
  },
  initAccrow(type) {
    const arrowTexture = PIXI.Texture.from('/SMR/image/' + type + '.png')
    const arrow = PIXI.Sprite.from(arrowTexture)
    arrow.scale.set(2, -2)
    // arrow.pivot.set(arrow.width / 2, - arrow.height / 2)
    arrow.anchor.set(0.5)
    arrow.visible = false
    arrow.name = type
    arrow.zIndex = 100
    return arrow
  }
}

export default smrTool;