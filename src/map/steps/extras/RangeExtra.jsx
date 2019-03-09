import L from 'leaflet';
import GeoService from '../../../services/GeoService';
import * as moment from 'moment';
import * as navExtra from './navExtra';

const rangeExtraProps = {
    icon: navExtra.archIcon,
}

export default class RangeExtra {
    static addTo(map, options) {
        const time = options.time ? moment(options.time).format("HH:mm") : "Error";
        const length = options.length || options.length === 0 ? options.length : 0;

        const marker = L.marker(
            options.position,
            {
                ...rangeExtraProps,
                rotationAngle: options.angle,
            }
        ).addTo(map);

        marker.bindTooltip(`${time} / ${length} M`, {
            permanent: true,
            offset: [0, 10 * +GeoService.isNorth(options.angle)],
        });

        return marker;
    }
}
