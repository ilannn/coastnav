import L from 'leaflet';
import StepService from '../../../services/StepService';

const doubleArrowIcon = L.icon({
    iconUrl: 'double.png',
    iconSize: [40, 40], // size of the icon
    iconAnchor: [20, 20], // point of the icon which will correspond to marker's location
});
const cogStepProps = {
    color: 'black',
    width: 8,
}
const cogMarkerProps = {
    // Put marker's const props here..
    icon: doubleArrowIcon,
}

export default class CogStep {
    static addTo(map, options) {
        let step = L.polyline(options.positions, { ...cogStepProps }).addTo(map);
        let markerPosition = options.marker && options.marker.position
            ? options.marker.position : step.getCenter();
        let marker = L.marker(markerPosition, {
            ...cogMarkerProps,
            rotationAngle: StepService.calcAngle.apply(null, options.positions)
        }).addTo(map);
        return [step, marker];
    }
}
