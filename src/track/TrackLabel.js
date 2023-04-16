import { Container } from "pixi.js";
import { protoHandle, BaseTrackClass, } from './trackUtils';
import TrackText from "./TrackText";
import TrackBgPlate from "./TrackBgPlate";

export default class TrackLabel extends BaseTrackClass {
    constructor(trackData) {
        super();
        const trackLabel = new Container();
        // text
        const trackTexts = new TrackText(trackData);
        trackLabel.trackTexts = trackTexts;
        trackLabel.addChild(trackTexts);
        // rect
        const rect = new TrackBgPlate(trackData);
        trackLabel.labelRect = rect;
        trackLabel.addChild(rect);
        protoHandle(this, trackLabel);
        trackLabel.pivot.set(0.5);
        return trackLabel;
    }
}