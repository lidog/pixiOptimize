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
        redrawLine(trackLabel, trackLine);
      }
    })
    trackLabel.on("pointerup", () => {
      isDragEnd = true;
    });
  }, trackLabel)
}

function redrawLine(label, line) {
  let rect_pos = label.position;
  let line_pos = line.position;
  // Math.atan2 计算二维坐标系中任意一个点(x,y)和原点(0,0)的连线与x轴正半轴的夹角角度
  let criticalTheta = Math.atan2(label.height / 2, label.width / 2);
  //Math.sqrt 求平方根
  let distance = Math.sqrt(
    // Math.pow(a, b) 计算a的b次方
    Math.pow(rect_pos.x - line_pos.x, 2) +
    Math.pow(rect_pos.y - line_pos.y, 2)
  );
  let dd = 0
  let theta = Math.atan2(rect_pos.y - line_pos.y, rect_pos.x - line_pos.x);
  if (
    Math.abs(theta) < criticalTheta ||
    Math.abs(theta) > Math.PI - criticalTheta
  ) {
    dd = label.width / 2 / Math.abs(Math.cos(Math.abs(theta)));
  } else {
    dd = label.height / 2 / Math.abs(Math.sin(Math.abs(theta)));
  }
  if (distance - dd > 0) {
    line.rotation = theta;
    line.width = distance - dd;
  } else {
    line.rotation = 0;
    line.width = 0;
  }
}