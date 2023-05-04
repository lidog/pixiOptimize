import { Container } from "pixi.js";
import { protoHandle, BaseTrackClass, renderedTrackMap, trackConfig } from './trackUtils';
import TrackCircle from "./TrackCircle";
import TrackLabelAndLine from "./TrackLabelAndLine";

/**
 * 把 track 部件组装起来，结构如下： 
 * track: {
 *   labelCircle,
 *   labelAndLine: {
 *      labelLine
 *      label: {
 *          labelRect,
 *          labelTexts: {
 *              callSign, flyType, runway, stripState
 *          }
 *      }    
 *   }       
 * }
 * 每个部件都会拥有 BaseTrackClass 的所有方法；以及自定义的update方法；
*/
export default class Track extends BaseTrackClass {
    constructor(trackData) {
        super();
        const container = new Container();
        container.trackData = trackData;
        // label and line
        const trackLabelAndLine = new TrackLabelAndLine(trackData);
        container.addChild(trackLabelAndLine);
        container.trackLine = trackLabelAndLine.trackLine;
        container.trackLabel = trackLabelAndLine.trackLabel;
        // circle
        const circle = new TrackCircle(trackData);
        container.addChild(circle);
        // 处理原型链；
        protoHandle(this, container);
        // 返回容器；
        container.name = `track_${trackData.TrackNumber}`;
        container.trackType = 'track';
        container.position.set(trackData.xPoint, trackData.yPoint);
        return container;
    }
    update(newTrackData) {
        // 更新子组件；
        this.dom.children.forEach(children => children?.update?.(newTrackData));
        // 自己的更新处理
        const {xPoint, yPoint} = newTrackData;
        this.setPosition(xPoint, yPoint);
    }
    updateAngle() {
        // this.dom.angle = -180;
    }
    // 销毁实例；
    destroy() {
        this.dom.parent.removeChild(this.dom);
        delete renderedTrackMap[this.dom.trackData.TrackNumber];
    }
}