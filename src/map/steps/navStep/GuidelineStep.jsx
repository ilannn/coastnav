import L from 'leaflet';

const guidelineProps = {
    color: 'grey',
    dashArray: '4',
}
export default class GuidelineStep {
    static addTo(map, options) {
        L.polyline(options.positions, {...guidelineProps}).addTo(map);
    }
}