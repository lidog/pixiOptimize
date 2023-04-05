import Track from "./Track";

const renderedTrackMap = Object.create(null);
const isNewTrack = trackNumber => !renderedTrackMap[trackNumber];

export default function renderTrack(trackData, app) {
    const {TrackNumber} = trackData
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