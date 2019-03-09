import L from 'leaflet';


/* Extras Icons */

export const archIcon = L.icon({
    iconUrl: 'arch.png',
    iconSize: [120, 40], // size of the icon
    iconAnchor: [60, 10], // point of the icon which will correspond to marker's location
});

export const pointIcon = L.icon({
    iconUrl: 'point.png',
    iconSize: [50, 50], // size of the icon
    iconAnchor: [25, 25], // point of the icon which will correspond to marker's location
});
