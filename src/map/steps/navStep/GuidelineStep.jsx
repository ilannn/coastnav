import L from 'leaflet';
import GeoService from '../../../services/GeoService';
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
            ...GeoService.calcDistance(
                ...Object.values(step.getLatLngs())
            )
        };
        let angle = GeoService.calcAngle(
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