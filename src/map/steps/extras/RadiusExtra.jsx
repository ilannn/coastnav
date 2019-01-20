import L from 'leaflet';
import * as moment from 'moment';

export default class RadiusExtra {
    static addTo(map, options) {
        let time = options.time ? moment(options.time).format("HH:mm") : "Error";
        //let radius = options.radius ? options.radius : 'Error';
        let length = options.length ? options.length : 1;
        let radius = options.radius ? options.radius : 50;
        
        let circle = L.circleMarker(
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
