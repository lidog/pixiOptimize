import { protoHandle, BaseTrackClass } from "./trackUtils";
import { Container } from "pixi.js";
import TrackLabel from "./TrackLabel";
import TrackLine from "./TrackLine";

export default class TrackLabelAndLine extends BaseTrackClass {
  constructor(trackData) {
    super();
    const trackLabelAndLine = new Container();
    // label
    const trackLabel = new TrackLabel(trackData);
    trackLabelAndLine.addChild(trackLabel);
    // line
    const line = new TrackLine(trackData);
    trackLabelAndLine.addChild(line);

    protoHandle(this, trackLabelAndLine);
    trackLabelAndLine.name = "trackLabelAndLine";
    return trackLabelAndLine;
  }
  update(newTrackData) {
    this.dom.children.forEach((children) => children?.update?.(newTrackData));
  }
}
