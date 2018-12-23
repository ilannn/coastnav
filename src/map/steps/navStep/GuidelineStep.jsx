import L from 'leaflet';
import StepService from '../../../services/StepService';

const guidelineProps = {
    color: 'grey',
    dashArray: '4',
}
export default class GuidelineStep {
    static addTo(map, options) {
        let step = L.polyline(options.positions, { ...guidelineProps }).addTo(map);
        let infoPosition = options.infoPosition ? options.infoPosition : step.getCenter();
        let { dist, unit } = {
            ...StepService.calcDistance(
                ...Object.values(step.getLatLngs())
            )
        };
        let angle = StepService.calcAngle(
            ...Object.values(step.getLatLngs())
        );
        step.bindTooltip(`${angle}° / ${dist} ${unit}`, {
            permanent: true,
        });
    }
}