import L from 'leaflet';
import GeoService from '../../../services/GeoService';
import * as moment from 'moment';
import * as navExtra from './navExtra';

const drExtraProps = {
    icon: navExtra.archIcon
}

export default class DRExtra {
    static addTo(map, options) {
        let marker = L.marker(
            options.position,
            {
                ...drExtraProps,
                rotationAngle: options.angle,
            }
        ).addTo(map);
        let time = options.time ? moment(options.time).format("HH:mm") : "Error";
        marker.bindTooltip(`${time}`, {
            permanent: true,
            offset: [0, 10 * +GeoService.isNorth(options.angle)],
        });
        return [marker];
    }
}
