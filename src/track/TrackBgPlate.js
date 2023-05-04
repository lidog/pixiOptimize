import { Graphics, Sprite, SCALE_MODES } from "pixi.js";
import {
  protoHandle,
  BaseTrackClass,
  getApparentStatus,
  trackBus,
  trackConfig,
} from "./trackUtils";
import { tagsTypeArr } from "./trackConst";
// 实例化背景板
export default class TrackBgPlate extends BaseTrackClass {
  constructor(trackData) {
    super();
    const { size, style } = getApparentStatus(trackData.arrDep, "label");
    const labelSize = tagsTypeArr[0];
    const graphics = new Graphics();
    graphics.beginFill(style.fill.color, style.fill.alpha);
    graphics.drawRoundedRect(0, 0, labelSize.w, labelSize.h, size.r);
    graphics.endFill();
    const graphicsTexture = window.app.renderer.generateTexture(
      graphics,
      SCALE_MODES.NEAREST,
      2
    );
    const rectSprite = new Sprite(graphicsTexture);
    // 标牌点击事件
    rectSprite.pivot.set(labelSize.w / 2, labelSize.h / 2);
    rectSprite.position.set(0);
    rectSprite.name = "trackBgPlate";
    rectSprite.alpha = trackConfig.labelAlpha;
    rectSprite.scale.set(1, 1);
    protoHandle(this, rectSprite);
    this.someEvents();
    return rectSprite;
  }
  update(newTrackData) {
    this.dom.children.forEach((children) => children?.update?.(newTrackData));
  }
  someEvents() {
    // 恢复默认透明度；
    trackBus.$off("trackBgPlate:alpha");
    trackBus.$on("trackBgPlate:alpha", (alpha) => (this.dom.alpha = alpha));
  }
  // updateAlarm(newTrackData) {
  //     const oldTrackData = this.getTrackData();
  //     if (JSON.stringify(newTrackData.alarm) !== JSON.stringify(oldTrackData.alarm)) {
  //         // todo 判断是否已经存在对于的告警边框，存在则显示，不存在则生成并addChild；
  //     }
  // }
}
