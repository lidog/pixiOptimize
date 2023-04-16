import { renderedTrackMap, renderedTrackDataMap, isNewTrack } from "./trackUtils";
import Track from "./Track";

export default function renderTrack(trackData) {
    const { TrackNumber } = trackData
    renderedTrackDataMap[TrackNumber] = trackData;
    if (isNewTrack(TrackNumber)) {
        const track = new Track(trackData);
        // 缓存track实例；
        renderedTrackMap[TrackNumber] = track;
        return track;
    } else {
        return renderedTrackMap[TrackNumber].updateTrack(trackData);
    }
}