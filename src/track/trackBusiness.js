import { trackBus, renderedTrackMap, trackConfig } from "./trackUtils";

// 定义一些 track 的交互
export default function trackBusiness(trackDom, viewport) {
  const { trackLabel, trackLine, trackData } = trackDom;
  // 标牌背景恢复默认透明度；
  trackBus.$on("trackBgPlate:alpha:default", () => {
    trackLabel.trackBgPlate.alpha = trackConfig.labelAlpha;
  });

  // 给viewport 添加一些track工具方法；
  addSomeTrackUtil(viewport);
  function addSomeTrackUtil(viewport) {
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
}
