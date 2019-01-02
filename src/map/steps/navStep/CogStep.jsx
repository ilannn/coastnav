import L from 'leaflet';

const cogStepProps = {
    color: 'black',
    width: 8,
}
const cogMarkerProps = {
    // Put marker's const props here..
}

export default class CogStep {
    static addTo(map, options) {
        let step = L.polyline(options.positions, { ...cogStepProps }).addTo(map);
        let markerPosition = options.marker && options.marker.position
            ? options.marker.position : step.getCenter();
        let markersPositions = [
            { lat: markerPosition.lat - 0.0001, lng: markerPosition.lng - 0.0001 },
            { lat: markerPosition.lat + 0.001, lng: markerPosition.lng + 0.001 },
        ];
        let marker1 = L.marker(markersPositions[0], cogMarkerProps).addTo(map);
        let marker2 = L.marker(markersPositions[1], cogMarkerProps).addTo(map);
        return [step, marker1, marker2];
    }
}
