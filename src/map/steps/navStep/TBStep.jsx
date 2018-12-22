import L from 'leaflet';

const tbStepProps = {
    color: 'black',
    dashArray: '4',
    width: 8,
}
const tbMarkerProps = {

}

export default class TBStep {
    static addTo(map, options) {
        let step = L.polyline(options.positions, { ...tbStepProps }).addTo(map);
        let position = options.marker && options.marker.position
            ? options.marker.position : step.getCenter();
        L.marker(position, tbMarkerProps).addTo(map);
    }
}
