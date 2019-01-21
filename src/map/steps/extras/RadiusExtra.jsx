import L from 'leaflet';
import * as moment from 'moment';
import GeoService from '../../../services/GeoService';

export default class RadiusExtra {
    static addTo(map, options) {
        let time = options.time ? moment(options.time).format("HH:mm") : "Error";
        let length = options.length ? options.length : 0;
        let radius = GeoService.toMeters(length);
        
        let circle = L.circle(
            options.position, 
            {
                radius: radius,
            }
        ).addTo(map);
        
        circle.bindTooltip(`${time} / ${length} M`, {
            permanent: true,
            offset: [5, 0],
        });
        
        return [circle];
    }
}
