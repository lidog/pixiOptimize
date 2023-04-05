import { Container } from "pixi.js";
import { protoHandle, BaseTrackClass } from './trackUtils';
import TrackText from "./TrackText";
import TrackBgPlate from "./TrackBgPlate";
import TrackCircle from "./TrackCircle";
import TrackLine from "./TrackLine";

/**
 * 把 track 部件组装起来，结构如下： 
 * track: [
 *   labelRect,
 *   labelLine,
 *   labelCircle,
 *   labelText: [
 *      trackCallSign, trackFlyType, trackRunway, trackStripState
 *   ]           
 * ]
 * 每个部件都会拥有 BaseTrackClass 的所有方法；
*/
export default class Track extends BaseTrackClass {
    constructor(trackData) {
        super();
        const container = new Container();
        container.trackData = trackData;
        // text
        const text = new TrackText(trackData);
        container.labelText = text;
        container.addChild(text);

        // rect
        const rect = new TrackBgPlate(trackData);
        container.labelRect = rect;
        container.addChild(rect);

        // circle
        const circle = new TrackCircle(trackData);
        container.labelCircle = circle;
        container.addChild(circle);

        // line
        const line = new TrackLine(trackData);
        container.labelLine = line;
        container.addChild(line);

        // 处理原型链；
        this.instance = container;
        protoHandle(this, container);

        // 返回容器；
        return container;
    }
}