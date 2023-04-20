import { Container } from "pixi.js";
import { protoHandle, BaseTrackClass, getApparentStatus } from './trackUtils';
import TrackText from "./TrackText";
import TrackBgPlate from "./TrackBgPlate";
import { tagsTypeArr } from './trackConst';

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

        const {
            length: lineLength,
            angle: lineAngle,
        } = getApparentStatus(trackData.arrDep, 'line.size')
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
        trackLabel.pivot.set(0.5);
        trackLabel.name = 'trackLabel';
        return trackLabel;
    }
}