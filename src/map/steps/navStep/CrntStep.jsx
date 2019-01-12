import L from 'leaflet';
import StepService from '../../../services/StepService';
import * as navStep from './navStep';

const crntStepProps = {
    color: 'black',
    width: 8,
}
const crntMarkerProps = {
    // Put marker's const props here..
    icon: navStep.tripleArrowIcon,
}

export default class CrntStep {
    static addTo(map, options) {
        let step = L.polyline(options.positions, { ...crntStepProps }).addTo(map);
        let markerPosition = options.marker && options.marker.position
            ? options.marker.position : step.getCenter();
        let marker = L.marker(markerPosition, {
            ...crntMarkerProps,
            rotationAngle: StepService.calcAngle.apply(null, options.positions)
        }).addTo(map);
        let { dist, unit } = {
            ...StepService.calcDistance(
                ...Object.values(step.getLatLngs())
            )
        };
        let angle = StepService.calcAngle(
            ...Object.values(step.getLatLngs())
        );
        marker.bindTooltip(`${angle}° / ${dist} ${unit}`, {
            permanent: true,
            offset: [0, 15 * +StepService.isNorth(angle)],
        });
        return [step, marker];
    }
}
