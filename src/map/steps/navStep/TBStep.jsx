import L from 'leaflet';

const tbStepProps = {
    color: 'black',
    width: 8,
}
const tbMarkerProps = {
    // Put marker's const props here..
}

export default class TBStep {
    static addTo(map, options) {
        let step = L.polyline(options.positions, { ...tbStepProps }).addTo(map);
        let position = options.marker && options.marker.position
            ? options.marker.position : step.getCenter();
        let marker = L.marker(position, tbMarkerProps).addTo(map);
        return [step, marker];
    }
}
