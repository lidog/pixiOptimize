import {
  Container,
  Graphics,
  Sprite,
  Texture,
  SCALE_MODES,
  Text,
  Ticker,
} from "pixi.js";
import * as PIXI from "pixi.js";
import { MessageBox } from "element-ui";
import { DashLine } from "pixi-dashed-line";
// import dayjs from 'dayjs'
// styleClass : 标牌及目标全局样式配置
// labelTextConfig : 标牌内容样式配置
// labelType : 标牌类型 简/全
class Track {
  constructor(track, app, scale, styleClass, labelTextConfig, labelType) {
    styleClass = styleClass || APPARENT_STATUS;
    this.app = app;
    this.scale = scale;
    this.track = track;
    this.apparent =
      this.track.arrDep === 0 ? styleClass[1] : styleClass[this.track.arrDep];
    this.texture = new TrackTexture(this.apparent, app, track);
    this.target = this.initTarget();
    this.ensemble = this.initEnsenble(labelTextConfig, labelType);
  }

  //  生成目标
  initTarget() {
    // 目标
    let x = this.track.xPoint;
    let y = this.track.yPoint;
    const target = new Sprite(this.texture.target);
    target.name = this.track.TrackNumber; //callsign
    target.anchor.set(0.5);
    target.position.set(x, y);
    return target;
  }
  // 生成字体
  generateText(obj) {
    const defaultFontStyle = {
      fontFamily: "Bahnschrift",
      fontSize: 14,
      fill: this.apparent.label.style.text.color,
    };
    const style = obj?.style || defaultFontStyle;
    style.stroke = "#000000"; // 描边颜色
    style.strokeThickness = 1; // 描边宽度
    const text = new Text(obj.value, style);
    // text.anchor.set(0.5)
    text.position.set(obj.x, obj.y);
    text.visible = obj.visible;
    return text;
  }
  parseConfig(obj1, obj2) {
    for (let a in obj1) {
      for (let b in obj2) {
        if (a === b) {
          obj1[a].style = obj2[b].style;
        }
      }
    }
    return obj1;
  }
  //生成标牌
  // params
  // config 标牌样式配置
  // labelType 标牌类型
  initEnsenble(config, labelType) {
    // 标牌内容默认配置
    const defaultLabelTextConfig = {
      callSign: {
        visible: true,
        style: {
          fontFamily: "Bahnschrift",
          fontSize: 18,
          fill: this.apparent.label.style.text.color,
          fontWeight: "bold",
        },
      },
      runway: {
        visible: true,
        style: {
          fontFamily: "Bahnschrift",
          fontSize: 14,
          fill: this.apparent.label.style.text.color,
          fontWeight: "bold",
        },
      },
      StripState: {
        visible: true,
        style: {
          fontFamily: "Bahnschrift",
          fontSize: 14,
          fill: this.apparent.label.style.text.color,
          fontWeight: "bold",
        },
      },
    };
    labelType = labelType || 0;
    const labelTextConfig = config || defaultLabelTextConfig;
    let lineStyle = this.apparent.line.style;
    let labelSize = this.apparent.label.size;
    labelSize.h = tagsTypeArry[labelType].h;
    labelSize.w = tagsTypeArry[labelType].w;
    let lineLength = this.apparent.line.size.length;
    let lineAngle = this.apparent.line.size.angle;
    let radius = this.apparent.target.radius.nor;
    let x = this.track.xPoint;
    let y = this.track.yPoint;
    // 标牌+引线容器
    const ensemble = new Container();
    ensemble.name = this.track.TrackNumber; //callsign
    ensemble.position.set(x + radius, y + radius);
    // 引线
    let line = null;
    // 虚拟引线
    if (this.track.isvirtually) {
      let lineG = new Graphics();
      this.drawDashLine(lineG);
      const lineTexture = this.app.renderer.generateTexture(
        lineG,
        SCALE_MODES.NEAREST,
        2
      );
      line = new Sprite(lineTexture);
      line.height = 10;
    } else {
      line = new Sprite(Texture.WHITE);
      line.height = lineStyle.width;
    }
    line.tint = lineStyle.color;
    line.width = lineLength;
    line.alpha = lineStyle.alpha;
    // line.width = lineLength - labelSize.h / 2 / Math.cos(((360 - lineAngle) * Math.PI) / 180)
    line.rotation = lineAngle;
    line.position.set(0);
    // 标牌容器
    const label = new Container();
    label.pivot.set(0.5);
    let dd = 0;
    let criticalTheta = Math.atan2(labelSize.h / 2, labelSize.w / 2);
    if (
      Math.abs(lineAngle) < criticalTheta ||
      Math.abs(lineAngle) > Math.PI - criticalTheta
    ) {
      dd = labelSize.w / 2 / Math.abs(Math.cos(Math.abs(lineAngle)));
    } else {
      dd = labelSize.h / 2 / Math.abs(Math.sin(Math.abs(lineAngle)));
    }
    label.position.set(
      (lineLength + dd) * Math.cos(lineAngle),
      (lineLength + dd) * Math.sin(lineAngle)
    );
    // 标牌-边框
    const rectSprite = new Sprite(this.texture.label);
    rectSprite.height = labelSize.h;
    rectSprite.width = labelSize.w;
    // 标牌点击事件
    rectSprite.anchor.set(0.5); // !important
    rectSprite.position.set(0);
    // 标牌-文本
    const isHavePlanText = !this.track.relatedFlag === 0 ? "*" : "";
    const isHaveRouteText = this.track.relatedFlag === 2 ? "*" : "";
    // 全标牌
    let alllabelText = {
      callSign: {
        visible: true,
        value: isHavePlanText + this.track.callSign + isHaveRouteText,
        x: -labelSize.w / 2 + 2,
        y: -labelSize.h / 2,
      },
      isControllStr: {
        visible: this.track.isControll,
        value: "■",
        style: {
          fontFamily: "Bahnschrift",
          fontSize: 12,
          fill: 0xffffbf,
          fontWeight: "bold",
        },
        x: -labelSize.w / 2 + this.track.callSign.length + 90,
        y: -labelSize.h / 2,
      },
      flyType: {
        visible: true,
        value: this.track.flyType,
        x: -labelSize.w / 4 + this.track.callSign.length + 50,
        y: -labelSize.h / 2,
      },
      runway: {
        visible: true,
        value: this.track.runway,
        x: labelSize.w / 2 - 27,
        y: -labelSize.h / 2,
      },
      aircraftType: {
        visible: true,
        value: this.track.aircraftType + "/",
        x: -labelSize.w / 2 + 3,
        y: -labelSize.h / 5,
      },
      wakeType: {
        visible: true,
        value: this.track.wakeType,
        x: -labelSize.w / 2 + this.track.aircraftType.length + 33,
        y: -labelSize.h / 5,
      },
      DestAirport: {
        visible: true,
        value: this.track.DestAirport,
        x: labelSize.w / 2 - 80,
        y: -labelSize.h / 5,
      },
      actTime: {
        visible: true,
        value: 1962,
        x: labelSize.w / 2 - 30,
        y: -labelSize.h / 5,
      },
      SID: {
        visible: true,
        value: this.track.SID,
        x: -labelSize.w / 2 + 3,
        y: labelSize.h / 30,
      },
      StripState: {
        visible: true,
        value: this.track.StripState,
        x: labelSize.w / 2 - 30,
        y: labelSize.h / 30,
      },
      freeText: {
        visible: true,
        value: "FREETEXT",
        x: -labelSize.w / 2 + 3,
        y: labelSize.h / 4,
      },
      isForeignPilots: {
        visible: true,
        value: this.track.isForeignPilots ? "E" : "",
        x: labelSize.w / 2 - 13,
        y: labelSize.h / 4,
      },
    };
    // 简标牌
    let simplelabelText = {
      callSign: {
        visible: true,
        value: isHavePlanText + this.track.callSign + isHaveRouteText,
        x: -labelSize.w / 2 + 2,
        y: -labelSize.h / 2 - 2,
      },
      isControllStr: {
        visible: this.track.isControll,
        value: "■",
        style: {
          fontFamily: "Bahnschrift",
          fontSize: 12,
          fill: 0xffffbf,
          fontWeight: "bold",
        },
        x: -labelSize.w / 2 + this.track.callSign.length + 75,
        y: -labelSize.h / 2 - 2,
      },
      runway: {
        visible: true,
        value: this.track.runway,
        x: labelSize.w / 2 - 27,
        y: -labelSize.h / 2,
      },
      flyType: {
        visible: true,
        value: this.track.flyType,
        x: -labelSize.w / 2 + 2,
        y: -labelSize.h / 7,
      },
      wakeType: {
        visible: true,
        value: this.track.wakeType,
        x: -labelSize.w / 4,
        y: -labelSize.h / 7,
      },
      StripState: {
        visible: true,
        value: this.track.StripState,
        x: labelSize.w / 2 - 30,
        y: -labelSize.h / 7,
      },
      // freeText: {
      //   visible: true,
      //   value: "FREETEXT",
      //   x: -labelSize.w / 2 + 3,
      //   y: labelSize.h / 4 - 5,
      // },
      isForeignPilots: {
        visible: true,
        value: this.track.isForeignPilots ? "E" : "",
        x: labelSize.w / 2 - 13,
        y: labelSize.h / 4 - 5,
      },
    };
    alllabelText = this.parseConfig(alllabelText, labelTextConfig);
    simplelabelText = this.parseConfig(simplelabelText, labelTextConfig);
    let labelText = labelType === 0 ? simplelabelText : alllabelText;
    label.name = "label";
    // 赋值数据集，方便更新
    label.labelDataSet = labelText;
    label.addChild(rectSprite);
    // 添加文本
    for (let a in labelText) {
      const textObj = this.generateText(labelText[a]);
      label.addChild(textObj);
    }
    ensemble.addChild(label);
    ensemble.addChild(line);
    ensemble.scale.set(1 / this.scale, -1 / this.scale);
    return ensemble;
  }
  // 生成告警图形
  generateRec(el, style) {
    let rec = new Graphics();
    rec.beginFill(el.bgColor, 1);
    rec.drawRoundedRect(0, 0, style.width, style.height, style.border);
    rec.endFill();
    const rectTexture = this.app.renderer.generateTexture(
      rec,
      SCALE_MODES.NEAREST,
      2
    );
    const recSp = new Sprite(rectTexture);
    const text = new Text(el.alarmTypeName, {
      fontFamily: style.fontFamily,
      fontSize: style.fontSize,
      fill: el.fontColor,
      lineHeight: style.height,
      fontWeight: style.fontWeight,
    });
    text.anchor.x = 0.5;
    text.x = recSp.width / 2;
    recSp.addChild(text);
    const ticker = new Ticker();
    ticker.start();
    let tickerCnt = 0;
    ticker.add(() => {
      if (tickerCnt > 25) {
        tickerCnt = 0;
        recSp.alpha = recSp.alpha == 1 ? 0.5 : 1;
      }
      tickerCnt++;
    });
    recSp.name = "alarm_text";
    return recSp;
  }
  // 绘制虚拟边框
  generateDashBorder(g, label) {
    const dash = new DashLine(g, {
      dash: [10, 5],
      width: 1,
      color: this.apparent.target.style.border.color,
      useTexture: false,
    });
    dash.drawRect(
      -label.width / 2,
      -label.height / 2,
      label.width,
      label.height
    );
    const ticker = new Ticker();
    ticker.start();
    let tickerCnt = 0;
    ticker.add(() => {
      if (tickerCnt > 10) {
        tickerCnt = 0;
        g.visible = !g.visible;
      }
      tickerCnt++;
    });
    setTimeout(() => {
      ticker.stop();
      g.visible = true;
      g.filters = [];
    }, 4000);
  }
  // 绘制虚线圆
  drawDashCircle(g) {
    const dash = new DashLine(g, {
      dash: [10, 5],
      width: this.apparent.target.style.border.width,
      color: this.apparent.target.style.border.color,
      useTexture: false,
    });
    dash.drawCircle(0, 0, this.apparent.target.radius.nor);
    const ticker = new Ticker();
    ticker.start();
    let tickerCnt = 0;
    ticker.add(() => {
      if (tickerCnt > 10) {
        tickerCnt = 0;
        g.visible = !g.visible;
      }
      tickerCnt++;
    });
    setTimeout(() => {
      ticker.stop();
      g.visible = true;
    }, 4000);
  }
  // 绘制虚线引线
  drawDashLine(g) {
    const dash = new DashLine(g, {
      dash: [10, 5],
      width: this.apparent.target.style.border.width,
      color: this.apparent.target.style.border.color,
      useTexture: false,
    });
    dash.moveTo(0, 0);
    dash.lineTo(80, 50);
  }
  // 告警边框
  generateAlertLevelTemplate(label, track, alramConfig) {
    const defaultAlramConfig = {
      alramArry: [
        {
          type: 1,
          bgColor: 0xf44336,
          fontColor: 0xffffff,
        },
        {
          type: 2,
          bgColor: 0xe99c3d,
          fontColor: 0x000000,
        },
        {
          type: 3,
          bgColor: 0xffec3a,
          fontColor: 0x000000,
        },
        {
          type: 4,
          bgColor: 0xffec3a,
          fontColor: 0x000000,
        },
      ],
      style: {
        width: 38,
        height: 20,
        border: 2,
        fontSize: 14,
        fontWeight: "bold",
        fontFamily: "Bahnschrift",
      },
    };
    alramConfig = defaultAlramConfig || alramConfig;
    let trackAlram = track.alarm;
    trackAlram.forEach((e) => {
      const obj = alramConfig.alramArry.find(
        (element) => element.type === e.level
      );
      e.bgColor = obj ? obj.bgColor : "0xFFEC3A";
      e.fontColor = obj ? obj.fontColor : "0x000000";
    });
    let num = 0;
    let lineNum = 0;
    // 绘制告警
    trackAlram.forEach((element, i) => {
      let rec = this.generateRec(element, alramConfig.style);
      if (label.width > i * alramConfig.style.width + i * 10) {
        rec.position.set(
          -label.width / 2 + i * alramConfig.style.width + i * 3,
          label.y - alramConfig.style.height + 34
        );
        num++;
        lineNum = parseInt(i / num) + 1;
      } else {
        let c = i - num * parseInt(i / num);
        rec.position.set(
          -label.width / 2 + c * alramConfig.style.width + c * 3,
          label.y - alramConfig.style.height + 34 - 22 * parseInt(i / num)
        );
        lineNum = parseInt(i / num) + 1;
      }
      if (i === 0) {
        let rectBorder = new Graphics();
        rectBorder.lineStyle(1, element.bgColor, 1);
        rectBorder.beginFill(element.bgColor, 0);
        rectBorder.drawRoundedRect(0, 0, label.width, label.height, 2);
        rectBorder.endFill();
        const rectTexture = this.app.renderer.generateTexture(
          rectBorder,
          SCALE_MODES.NEAREST,
          2
        );
        const sp = new Sprite(rectTexture);
        sp.name = "alram_border";
        sp.anchor.set(0.5);
        // sp.position.set(0, 0)
        label.addChild(sp);
        const ticker = new Ticker();
        ticker.start();
        let tickerCnt = 0;
        ticker.add(() => {
          if (tickerCnt > 25) {
            tickerCnt = 0;
            sp.visible = !sp.visible;
          }
          tickerCnt++;
        });
      }
      label.addChild(rec);
    });
    // 返回告警总行数，方便计算位置
    label.lineNum = lineNum;
  }
  // 自由文本填写
  openInputFreeTextDialog(event) {
    const label = event.target;
    const n1 = label.text.indexOf(">") + 1;
    const n2 = label.text.indexOf("</");
    MessageBox.prompt("请输入自由文本", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      inputValue: label.text.substring(n1, n2),
      inputPattern: /^.{1,6}$/,
      inputErrorMessage: "字符串长度在1-6之间",
      modal: false,
    })
      .then(({ value }) => {
        label.text =
          '<span style="display:inline-block;width:80px;height:16px;">' +
          value +
          "</span>";
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "取消输入",
        });
      });
  }
}

class TrackTexture {
  constructor(apparent, app, track) {
    this.apparent = apparent;
    this.app = app;
    PIXI.settings.STRICT_TEXTURE_CACHE = true;
    this.track = track;
    this.target = this.initTargetTexture();
    this.label = this.initLabelTexture();
  }

  initTargetTexture() {
    // try {
    //   return Texture.from("target" + this.track.arrDep);
    // } catch {
    // 绘制目标（图片代替？）
    const circle = new Graphics();
    let apparent = this.apparent;
    circle.lineStyle({
      width: apparent.target.style.border.width,
      color: apparent.target.style.border.color,
      alpha: this.track.isvirtually ? 0 : apparent.target.style.border.alpha,
    });
    circle.beginFill(
      apparent.target.style.fill.color,
      apparent.target.style.fill.alpha
    );
    circle.drawCircle(0, 0, apparent.target.radius.nor);
    circle.endFill();
    const circleTexture = this.app.renderer.generateTexture(
      circle,
      SCALE_MODES.NEAREST,
      2
    );
    // const circleTexture = PIXI.Texture.from(location.origin + '/round.png')
    // circleTexture.baseTexture.scaleMode = SCALE_MODES.NEAREST
    // Texture.addToCache(circleTexture, "target" + this.track.arrDep);
    return circleTexture;
    // }
  }

  initLabelTexture() {
    // try {
    //   return Texture.from("label" + this.track.arrDep);
    // } catch {
    // 绘制标牌
    const rect = new Graphics();
    let apparent = this.apparent;
    // rect.lineStyle(apparent.label.style.border)
    rect.beginFill(
      apparent.label.style.fill.color,
      apparent.label.style.fill.alpha
    );
    rect.drawRoundedRect(
      0,
      0,
      apparent.label.size.w,
      apparent.label.size.h,
      apparent.label.size.r
    );
    rect.endFill();
    const rectTexture = this.app.renderer.generateTexture(
      rect,
      SCALE_MODES.NEAREST,
      2
    );
    // rectTexture.baseTexture.scaleMode = SCALE_MODES.NEAREST
    // Texture.addToCache(rectTexture, "label" + this.track.arrDep);
    return rectTexture;
    // }
  }
}

// 标牌大小及目标等样式配置
// 起降标识，1出港， 2进港， 3本地， 4过境/飞越
const APPARENT_STATUS = {
  // 默认状态
  0: {
    label: {
      style: {
        fill: { color: 0x121110, alpha: 1 },
        text: { color: 0xffffff },
      },
      size: {
        w: 160,
        h: 75,
        r: 0,
      },
    },
    target: {
      style: {
        border: { width: 4, color: 0xffffff, alpha: 1 },
        fill: { color: 0xffffff, alpha: 0 },
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
        color: 0xffffff,
        alpha: 1,
      },
    },
  },
  // 离港
  1: {
    label: {
      style: {
        fill: { color: 0x121110, alpha: 1 },
        text: { color: 0xffffff },
      },
      size: {
        w: 160,
        h: 75,
        r: 0,
      },
    },
    target: {
      style: {
        border: { width: 4, color: 0xffffff, alpha: 1 },
        fill: { color: 0xffffff, alpha: 0 },
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
        color: 0xffffff,
        alpha: 1,
      },
    },
  },
  // 进港
  2: {
    label: {
      style: {
        fill: { color: 0x121110, alpha: 1 },
        text: { color: 0xb2e6ff },
      },
      size: {
        w: 160,
        h: 75,
        r: 0,
      },
    },
    target: {
      style: {
        border: { width: 4, color: 0xb2e6ff, alpha: 1 },
        fill: { color: 0xb2e6ff, alpha: 0 },
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
        color: 0xb2e6ff,
        alpha: 1,
      },
    },
  },
};

// 0,1,2简，详，扩展
const tagsTypeArry = [
  {
    h: 50,
    w: 133,
  },
  {
    h: 75,
    w: 160,
  },
  {
    h: 75,
    w: 160,
  },
];

export { Track };
