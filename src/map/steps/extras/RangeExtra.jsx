import L from 'leaflet';
import StepService from '../../../services/StepService';
import * as moment from 'moment';
import * as navExtra from './navExtra';

const rangeExtraProps = {
    icon: navExtra.archIcon,
}

export default class RangeExtra {
    static addTo(map, options) {
        let time = options.time ? moment(options.time).format("HH:mm") : "Error";
        let length = options.length ? options.length : 0;

        let marker = L.marker(
            options.position,
            {
                ...rangeExtraProps,
                rotationAngle: options.angle,
            }
        ).addTo(map);

        marker.bindTooltip(`${time} / ${length} M`, {
            permanent: true,
            offset: [0, 10 * +StepService.isNorth(options.angle)],
        });

        return [marker];
    }
}
