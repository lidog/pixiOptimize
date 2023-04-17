import { renderedTrackMap, renderedTrackDataMap, isNewTrack } from "./trackUtils";
import Track from "./Track";

export default function renderTrack(trackData) {
    const { TrackNumber } = trackData
    renderedTrackDataMap[TrackNumber] = trackData;
    if (isNewTrack(TrackNumber)) {
        const track = new Track(trackData);
        renderedTrackMap[TrackNumber] = track;
        return track;
    } else {
        renderedTrackMap[TrackNumber].updateTrack(trackData);
        return renderedTrackMap[TrackNumber];
    }
}