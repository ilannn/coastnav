import L from 'leaflet';
import StepService from '../../../services/StepService';
import * as navStep from './navStep';

const guidelineProps = {
    color: 'grey',
    dashArray: '4',
}
const guidelineMarkerProps = {
    icon: navStep.emptyIcon,
}
export default class GuidelineStep {
    static addTo(map, options) {
        let step = L.polyline(options.positions, { ...guidelineProps }).addTo(map);
        let { dist, unit } = {
            ...StepService.calcDistance(
                ...Object.values(step.getLatLngs())
            )
        };
        let angle = StepService.calcAngle(
            ...Object.values(step.getLatLngs())
        );
        let markerPosition = options.marker && options.marker.position
            ? options.marker.position : step.getCenter();
        let marker = L.marker(markerPosition, {
            ...guidelineMarkerProps,
        }).addTo(map);
        marker.bindTooltip(`${angle}° / ${dist} ${unit}`, {
            permanent: true,
        });
        return [step, marker];
    }
}