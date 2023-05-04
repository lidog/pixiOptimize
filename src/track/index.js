import { renderedTrackMap, isNewTrack } from "./trackUtils";
import Track from "./Track";
import trackBusiness from "./trackBusiness";

export default function renderTrack(trackData, viewport = {}) {
    const { TrackNumber } = trackData
    if (isNewTrack(TrackNumber)) {
        const track = new Track(trackData);
        renderedTrackMap[TrackNumber] = track;
        viewport.renderedTrackMap = renderedTrackMap;
        viewport.addChild(track);
        trackBusiness(track, viewport); // 一些业务逻辑；
        return track;
    } else {
        renderedTrackMap[TrackNumber].update(trackData);
        return renderedTrackMap[TrackNumber];
    }
}