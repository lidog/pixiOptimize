import { Text, Container } from "pixi.js";
import { protoHandle, BaseTrackClass } from './trackUtils';
export default class TrackText extends BaseTrackClass {
    constructor(trackData) {
        super();
        const {callSign, StripState, flyType, runway} = trackData;
        const textContainer = new Container();
        textContainer.trackCallSign = new myText(callSign);
        textContainer.trackFlyType = new myText(flyType);
        textContainer.trackRunway = new myText(runway);
        textContainer.trackStripState = new myText(StripState);
        textContainer.addChild(textContainer.trackCallSign);
        textContainer.addChild(textContainer.trackFlyType);
        textContainer.addChild(textContainer.trackRunway);
        textContainer.addChild(textContainer.trackStripState);
        textContainer.eventMode = 'static'
        this.instance = textContainer;
        protoHandle(this, textContainer);
        return textContainer;
    }
}

class myText extends BaseTrackClass {
    constructor(text) {
        super();
        const trackText = new Text(text);
        trackText.eventMode = 'static'
        this.instance = trackText; 
        protoHandle(this, trackText);
        return trackText;
    }
}