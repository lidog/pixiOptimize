import { Container } from "pixi.js";
import { protoHandle, BaseTrackClass } from './trackUtils';
import TrackLabel from "./TrackLabel";
import TrackCircle from "./TrackCircle";
import TrackLine from "./TrackLine";

/**
 * 把 track 部件组装起来，结构如下： 
 * track: [
 *   labelLine,
 *   labelCircle,
 *   label: [
 *      labelRect,
 *      labelText: [
 *           trackCallSign, trackFlyType, trackRunway, trackStripState
 *      ]
 *   ]        
 * ]
 * 每个部件都会拥有 BaseTrackClass 的所有方法；
*/
export default class Track extends BaseTrackClass {
    static instanceName = "track"
    constructor(trackData) {
        super();
        const container = new Container();
        container.trackData = trackData;
        // label
        const trackLabel = new TrackLabel(trackData);
        container.label = trackLabel;
        container.addChild(trackLabel);
        // circle
        const circle = new TrackCircle(trackData);
        container.labelCircle = circle;
        container.addChild(circle);
        // line
        const line = new TrackLine(trackData);
        container.labelLine = line;
        container.addChild(line);
        // 处理原型链；
        protoHandle(this, container);
        // container.scale.set(1/0.25, -1/0.25);
        // 返回容器；
        return container;
    }
    updateTrack(newTrackData) {
        console.log(newTrackData, 123848);
    }
}