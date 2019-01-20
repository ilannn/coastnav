import L from 'leaflet';
import * as moment from 'moment';

export default class RadiusExtra {
    static addTo(map, options) {
        let time = options.time ? moment(options.time).format("HH:mm") : "Error";
        //let radius = options.radius ? options.radius : 'Error';
        let radius = options.radius ? options.radius : 50;
        
        let circle = L.circleMarker(
            options.position, 
            {
                radius: radius,
            }
        ).addTo(map);
        
        circle.bindTooltip(`${time} / ${radius} M`, {
            permanent: true,
            offset: [5, 0],
        });
        
        return [circle];
    }
}
