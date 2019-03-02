import L from 'leaflet';
import GeoService from '../../../services/GeoService';
import * as navStep from './navStep';
import * as moment from 'moment';

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
        const step = L.polyline(options.positions, { ...tbStepProps }).addTo(map);
        const position = options.marker && options.marker.position
            ? options.marker.position : step.getCenter();
        const marker = L.marker(position, {
            ...tbMarkerProps,
            rotationAngle: GeoService.calcAngle.apply(null, options.positions)
        }).addTo(map);
        const angle = GeoService.calcAngle(
            ...Object.values(step.getLatLngs())
        );
        const time = options.time ? moment(options.time).format("HH:mm") : "Error";
        marker.bindTooltip(`${angle}° / ${time}`, {
            permanent: true,
            offset: [0, 5 * +GeoService.isNorth(angle)],
        });
        const addon = navStep.getAddon(map, options);
        if (addon) return [step, marker, addon];

        return [step, marker];
    }
}
