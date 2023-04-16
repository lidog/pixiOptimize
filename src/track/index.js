import { renderedTrackMap, isNewTrack } from "./trackUtils";
import Track from "./Track";

export default function renderTrack(trackData, app) {
    const { TrackNumber } = trackData
    if (isNewTrack(TrackNumber)) {
        const track = new Track(trackData);
        app.stage.addChild(track);
        renderedTrackMap[TrackNumber] = track;
        return track;
    } else {
        // transformTrack(trackData);
        return renderedTrackMap[TrackNumber];
    }
}