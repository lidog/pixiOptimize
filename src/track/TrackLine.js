import { Sprite, Texture, Graphics, SCALE_MODES } from "pixi.js";
import { protoHandle, BaseTrackClass, getApparentStatus, trackConfig } from "./trackUtils";
import { DashLine } from "pixi-dashed-line";

// 实例化背景板
export default class TrackLine extends BaseTrackClass {
  constructor(trackData) {
    super();
    const {
      size: { length, angle },
      style: { width, color, alpha },
    } = getApparentStatus(trackData.arrDep, "line");
    // 引线
    let line = null;
    // 虚拟引线
    if (trackData.isvirtually) {
      let lineG = new Graphics();
      this.drawDashLine(lineG, trackData);
      const lineTexture = window.app.renderer.generateTexture(
        lineG,
        SCALE_MODES.NEAREST,
        2
      );
      line = new Sprite(lineTexture);
      line.height = 10;
    } else {
      line = new Sprite(Texture.WHITE);
      line.height = width;
    }
    line.tint = color;
    line.alpha = alpha;
    line.rotation = angle;
    line.width = length;
    line.position.set(0);
    protoHandle(this, line);
    line.name = "trackLine";
    return line;
  }
  update(newTrackData) {
    this.dom.children.forEach((children) => children?.update?.(newTrackData));
  }
  // 绘制虚线引线
  drawDashLine(lineG, trackData) {
    const { width, color } = getApparentStatus(
      trackData.arrDep,
      "target.style.border"
    );
    const dash = new DashLine(lineG, {
      dash: [10, 5],
      width,
      color,
      useTexture: false,
    });
    dash.moveTo(0, 0);
    dash.lineTo(80, 50);
  }
}
