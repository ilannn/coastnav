import L from 'leaflet';
import StepService from '../../../services/StepService';
import * as navStep from './navStep';

const tbStepProps = {
    color: 'black',
    width: 8,
}
const tbMarkerProps = {
    // Put marker's const props here..
    icon: navStep.singleArrowIcon,
}

export default class TBStep {
    static addTo(map, options) {
        let step = L.polyline(options.positions, { ...tbStepProps }).addTo(map);
        let position = options.marker && options.marker.position
            ? options.marker.position : step.getCenter();
        let marker = L.marker(position, {
            ...tbMarkerProps,
            rotationAngle: StepService.calcAngle.apply(null, options.positions)
        }).addTo(map);
        let angle = StepService.calcAngle(
            ...Object.values(step.getLatLngs())
        );
        marker.bindTooltip(`${angle}°`, {
            permanent: true,
            offset: [0, 10 * +StepService.isNorth(angle)],
        });
        return [step, marker];
    }
}
