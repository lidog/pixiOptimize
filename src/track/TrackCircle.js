import { Graphics, SCALE_MODES, Sprite } from "pixi.js";
import { protoHandle, BaseTrackClass, getApparentStatus, trackConfig } from "./trackUtils";
import { DashLine } from "pixi-dashed-line";

// 实例化目标园
export default class TrackCircle extends BaseTrackClass {
  constructor(trackData) {
    super();
    const {
      style: { border, fill },
      radius: { nor },
    } = getApparentStatus(trackData.arrDep, "target");
    const circle = new Graphics();
    circle.lineStyle({
      width: border.width,
      color: border.color,
      alpha: trackData.isvirtually ? 0 : border.alpha,
    });
    circle.beginFill(fill.color, fill.alpha);
    circle.drawCircle(0, 0, nor);
    circle.endFill();
    const circleTexture = window.app.renderer.generateTexture(
      circle,
      SCALE_MODES.NEAREST,
      2
    );
    const circleSprite = new Sprite(circleTexture);
    circleSprite.position.set(0, 0);
    circleSprite.anchor.set(0.5);
    circleSprite.scale.set(0.3/trackConfig.scale/4); // 缩放
    circleSprite.cursor = "pointer";
    circleSprite.interactive = true;
    protoHandle(this, circleSprite);
    circleSprite.name = "trackCircle";
    return circleSprite;
  }
  update(newTrackData) {
    this.dom.children.forEach((children) => children?.update?.(newTrackData));
    this.drawDashCircle();
  }
  // 绘制虚线圆
  drawDashCircle() {
    const trackData = this.getTrackData();
    const trackCircle = this.dom;
    if (!trackData.isvirtually) {
        if (trackCircle.dashCircle) trackCircle.removeChild(trackCircle.dashCircle);
        return;
    }
    if (trackCircle.dashCircle) return;
    const { width, color } = getApparentStatus(
      trackData.arrDep,
      "target.style.border"
    );
    const { nor } = getApparentStatus(trackData.arrDep, "target.radius");
    let g = trackCircle.addChild(new Graphics());
    g.name = 'dashCircle';
    trackCircle.dashCircle = g;
    const dash = new DashLine(g, {
      dash: [10, 5],
      width,
      color,
      useTexture: false,
    });
    dash.drawCircle(0, 0, nor);
    let timeStr = new Date().getTime();
    this.tickerTimer = setInterval(() => {
      g.visible = !g.visible;
      if (new Date().getTime() - timeStr > 4000) {
        clearInterval(this.tickerTimer);
        this.tickerTimer = null;
        g.visible = true;
      }
    }, 50);
  }
}
