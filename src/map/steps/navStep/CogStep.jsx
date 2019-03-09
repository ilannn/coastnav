import L from 'leaflet';
import GeoService from '../../../services/GeoService';
import * as navStep from './navStep';

const cogStepProps = {
    color: 'black',
    width: 8,
}
const cogMarkerProps = {
    // Put marker's const props here..
    icon: navStep.doubleArrowIcon,
}

export default class CogStep {
    static addTo(map, options) {
        const step = L.polyline(options.positions, { ...cogStepProps }).addTo(map);
        const markerPosition = options.marker && options.marker.position
            ? options.marker.position : step.getCenter();
        const marker = L.marker(markerPosition, {
            ...cogMarkerProps,
            rotationAngle: GeoService.calcAngle.apply(null, options.positions)
        }).addTo(map);
        let { dist, unit } = {
            ...GeoService.calcDistance(
                ...Object.values(step.getLatLngs())
            )
        };
        const angle = GeoService.calcAngle(
            ...Object.values(step.getLatLngs())
        );
        marker.bindTooltip(`${angle}° / ${dist} ${unit}`, {
            permanent: true,
            offset: [0, 15 * +GeoService.isNorth(angle)],
        });

        const addon = navStep.getAddon(map, options);
        if (addon) return [step, marker, addon];
        
        return [step, marker];
    }
}
