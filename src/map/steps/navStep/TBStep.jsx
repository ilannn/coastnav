import L from 'leaflet';

const greenIcon = L.icon({
    iconUrl: 'makefg.png',
    //shadowUrl: 'leaf-shadow.png',

    iconSize: [40, 40], // size of the icon
    //shadowSize: [50, 64], // size of the shadow
    iconAnchor: [20, 20], // point of the icon which will correspond to marker's location
    //shadowAnchor: [4, 62],  // the same for the shadow
    //popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
});
const tbStepProps = {
    color: 'black',
    width: 8,
}
const tbMarkerProps = {
    // Put marker's const props here..
    icon: greenIcon,
}

export default class TBStep {
    static addTo(map, options) {
        let step = L.polyline(options.positions, { ...tbStepProps }).addTo(map);
        let position = options.marker && options.marker.position
            ? options.marker.position : step.getCenter();
        let marker = L.marker(position, tbMarkerProps).addTo(map);
        return [step, marker];
    }
}
