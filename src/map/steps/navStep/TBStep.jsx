import L from 'leaflet';
import StepService from '../../../services/StepService';

const singleArrowIcon = L.icon({
    iconUrl: 'single.png',
    iconSize: [40, 40], // size of the icon
    iconAnchor: [20, 20], // point of the icon which will correspond to marker's location
});
const tbStepProps = {
    color: 'black',
    width: 8,
}
const tbMarkerProps = {
    // Put marker's const props here..
    icon: singleArrowIcon,
}

export default class TBStep {
    static addTo(map, options) {
        let step = L.polyline(options.positions, { ...tbStepProps }).addTo(map);
        let position = options.marker && options.marker.position
            ? options.marker.position : step.getCenter();
        let marker = L.marker(position, {
            ...tbMarkerProps,
            rotationAngle: StepService.calcAngle.apply(null, options.positions)
        });
        marker = marker.addTo(map);
        return [step, marker];
    }
}
