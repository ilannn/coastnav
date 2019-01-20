import L from 'leaflet';
import GeoService from '../../../services/GeoService';
import * as navStep from './navStep';

const tcStepProps = {
    color: 'black',
    width: 8,
}
const tcMarkerProps = {
    icon: navStep.doubleArrowIcon,
}

export default class TCStep {
    static addTo(map, options) {
        let step = L.polyline(options.positions, { ...tcStepProps }).addTo(map);
        let markerPosition = options.marker && options.marker.position
            ? options.marker.position : step.getCenter();
        let marker = L.marker(markerPosition, {
            ...tcMarkerProps,
            rotationAngle: GeoService.calcAngle.apply(null, options.positions)
        }).addTo(map);
        let { dist, unit } = {
            ...GeoService.calcDistance(
                ...Object.values(step.getLatLngs())
            )
        };
        let angle = GeoService.calcAngle(
            ...Object.values(step.getLatLngs())
        );
        marker.bindTooltip(`${angle}° / ${dist} ${unit}`, {
            permanent: true,
            offset: [0, 15 * +GeoService.isNorth(angle)],
        });
        return [step, marker];
    }
}
