import L from 'leaflet';
import * as moment from 'moment';
import * as navExtra from './navExtra';

const fixExtraProps = {
    icon: navExtra.pointIcon
}

export default class FixExtra {
    static addTo(map, options) {
        let marker = L.marker(
            options.position,
            {
                ...fixExtraProps,
            }
        ).addTo(map);
        let time = options.time ? moment(options.time).format("HH:mm") : "Error";
        marker.bindTooltip(`${time}`, {
            permanent: true,
            offset: [5, 0],
        });
        return [marker];
    }
}
