import { trackBus, renderedTrackMap, trackConfig } from "./trackUtils";

// 定义一些 track 的交互
export default function trackBusiness(trackDom, viewport) {
  const { trackLabel, trackLine, trackData } = trackDom;
  // 标牌背景恢复默认透明度；
  trackBus.$on("trackBgPlate:alpha:default", () => {
    trackLabel.trackBgPlate.alpha = trackConfig.labelAlpha;
  });
  trackUtilForViewport(viewport);
  DragLabel(trackDom, viewport);
}

// 给viewport 添加一些track工具方法；
function trackUtilForViewport(viewport) {
  viewport.forEachTrack = (callback) => {
    Object.keys(viewport.renderedTrackMap || {}).forEach((TrackNumber) => {
      callback(renderedTrackMap[TrackNumber], TrackNumber);
    });
  };
  viewport.setBgPlateAlpha = (alpha) => {
    trackBus.$emit("trackBgPlate:alpha", alpha);
  };
  viewport.getTrackDom = (TrackNumber) => {
    return renderedTrackMap[TrackNumber] || null;
  }
}

// 标牌拖拽
function DragLabel(trackDom, viewport) {
  const { trackLabel, trackLine, trackData } = trackDom;
  let mouseGlobal = [];
  let isDragEnd = false;
  trackLabel.off("pointerdown")
  trackLabel.on("pointerdown", event => {
    isDragEnd = false;
    mouseGlobal = [
      event.global.x,
      event.global.y,
    ]
    viewport.on("pointermove", moveEvent => {
      if (isDragEnd) {
        viewport.off("pointermove");
        return;
      }
      const { x, y } = moveEvent.global;
      const [downX, downY] = mouseGlobal;
      if (
        Math.abs(x - downX) > 10 ||
        Math.abs(y - downY) > 10
      ) {
        const point = trackLabel.toLocal(moveEvent.global);
        trackLabel.position.x = trackLabel.position.x + point.x;
        trackLabel.position.y = trackLabel.position.y + point.y;
      }
    })
    trackLabel.on("pointerup", () => {
      isDragEnd = true;
    });
  }, trackLabel)
}