import {
  Container,
  Graphics,
  Text,
  Ticker,
  SCALE_MODES,
  Sprite,
} from "pixi.js";
import { protoHandle, BaseTrackClass, getApparentStatus, renderFilterByColor, trackConfig } from "./trackUtils";
import TrackText from "./TrackText";
import TrackBgPlate from "./TrackBgPlate";
import { tagsTypeArr, colorArray, alramConfig } from "./trackConst";
import { DashLine } from "pixi-dashed-line";

export default class TrackLabel extends BaseTrackClass {
  constructor(trackData) {
    super();
    const trackLabel = new Container();
    // rect
    const rect = new TrackBgPlate(trackData);
    trackLabel.addChild(rect);
    // text
    const trackTexts = new TrackText(trackData);
    trackLabel.addChild(trackTexts);

    protoHandle(this, trackLabel);

    const { length: lineLength, angle: lineAngle } = getApparentStatus(
      trackData.arrDep,
      "line.size"
    );
    const labelSize = tagsTypeArr[0];
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
    trackLabel.position.set(
      (lineLength + dd) * Math.cos(lineAngle),
      (lineLength + dd) * Math.sin(lineAngle)
    );
    trackLabel.interactive = true;
    trackLabel.cursor = "pointer";
    trackLabel.name = "trackLabel";
    return trackLabel;
  }
  update(newTrackData) {
    this.dom.children.forEach((children) => children?.update?.(newTrackData));
    // this.generateDashBorder();
    // this.generateAlertLevelTemplate();
    // 告警滤镜有性能问题，待解决；
    // this.glowFilter();
  }
  // 告警边框
  generateAlertLevelTemplate() {
    const trackData = this.getTrackData();
    let trackAlram = trackData.alarm;
    const trackLabel = this.dom;
    trackLabel.children.forEach((children) => {
      if (children.name === "alramBorder" || children.name === "alarmText") {
        children?.parent?.removeChild(children);
      }
    });
    trackAlram.forEach((e) => {
      const obj = alramConfig.alramArray.find(
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
      if (trackLabel.width > i * alramConfig.style.width + i * 10) {
        rec.position.set(
          -trackLabel.width / 2 + i * alramConfig.style.width + i * 3,
          trackLabel.y - alramConfig.style.height + 34
        );
        num++;
        lineNum = parseInt(i / num) + 1;
      } else {
        let c = i - num * parseInt(i / num);
        rec.position.set(
          -trackLabel.width / 2 + c * alramConfig.style.width + c * 3,
          trackLabel.y - alramConfig.style.height + 34 - 22 * parseInt(i / num)
        );
        lineNum = parseInt(i / num) + 1;
      }
      if (i === 0) {
        let rectBorder = new Graphics();
        rectBorder.lineStyle(1, element.bgColor, 1);
        rectBorder.beginFill(element.bgColor, 0);
        rectBorder.drawRoundedRect(
          0,
          0,
          trackLabel.width,
          trackLabel.height,
          2
        );
        rectBorder.endFill();
        const rectTexture = window.app.renderer.generateTexture(
          rectBorder,
          SCALE_MODES.NEAREST,
          2
        );
        const sp = new Sprite(rectTexture);
        sp.name = "alramBorder";
        sp.anchor.set(0.5);
        trackLabel.addChild(sp);
        let timeStr = new Date().getTime();
        this.tickerTimer = setInterval(() => {
            sp.visible = !sp.visible;
          if (new Date().getTime() - timeStr > 4000) {
            clearInterval(this.tickerTimer);
            this.tickerTimer = null;
            sp.visible = true;
          }
        }, 50);
      }
      trackLabel.addChild(rec);
    });
    // 返回告警总行数，方便计算位置
    trackLabel.lineNum = lineNum;
  }
  // 生成告警图形
  generateRec(el, style) {
    let rec = new Graphics();
    rec.beginFill(el.bgColor, 1);
    rec.drawRoundedRect(0, 0, style.width, style.height, style.border);
    rec.endFill();
    const rectTexture = window.app.renderer.generateTexture(
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
    recSp.name = "alarmText";
    return recSp;
  }
  // 虚拟目标边框
  generateDashBorder() {
    const trackData = this.getTrackData();
    const trackLabel = this.dom;
    if (!trackData.isvirtually) {
      if (trackLabel.dashBorder) trackLabel.removeChild(trackLabel.dashBorder);
      return;
    }
    if (trackLabel.dashBorder) return;
    const { color } = getApparentStatus(
      trackData.arrDep,
      "target.style.border"
    );
    let labelG = trackLabel.addChild(new Graphics());
    labelG.name = "dashBorder";
    trackLabel.dashBorder = labelG;
    const dash = new DashLine(labelG, {
      dash: [10, 5],
      width: 1,
      color,
      useTexture: false,
    });
    dash.drawRect(
      -trackLabel.width / 2,
      -trackLabel.height / 2,
      trackLabel.width,
      trackLabel.height
    );
    const ticker = new Ticker();
    ticker.start();
    let tickerCnt = 0;
    ticker.add(() => {
      if (tickerCnt > 10) {
        tickerCnt = 0;
        labelG.visible = !labelG.visible;
      }
      tickerCnt++;
    });
    this.tickerTimer = setTimeout(() => {
      ticker.stop();
      labelG.visible = true;
      labelG.filters = [];
      clearTimeout(this.tickerTimer);
      this.tickerTimer = null;
    }, 4000);
  }
  // 添加告警滤镜
  glowFilter() {
    const trackData = this.getTrackData();
    const childrenArr = this.dom.children;
    childrenArr.forEach((children) => {
      if (children.name === "alramBorder" && trackData.alarm.length > 0) {
        let color = colorArray.find((i) => i.type === trackData.alarm[0].level);
        children.filters = renderFilterByColor(color ? color.bgColor : 0xffec3a);
      }
      if (children.name === "dashBorder") {
        children.filters = renderFilterByColor(0xffffff);
      }
    });
  }
}

