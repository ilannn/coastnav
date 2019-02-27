import L from 'leaflet';
import { AddonType } from '../../../models/addons';
import RangeExtra from '../extras/RangeExtra';
import DRExtra from '../extras/DRExtra';

/* Markers Icons */

export const emptyIcon = L.icon({
    iconUrl: 'empty.png',
    iconSize: [10, 10],
    iconAnchor: [5, 5],
});

export const singleArrowIcon = L.icon({
    iconUrl: 'single.png',
    iconSize: [40, 40], // size of the icon
    iconAnchor: [20, 20], // point of the icon which will correspond to marker's location
});

export const doubleArrowIcon = L.icon({
    iconUrl: 'double.png',
    iconSize: [40, 40], // size of the icon
    iconAnchor: [20, 20], // point of the icon which will correspond to marker's location
});

export const tripleArrowIcon = L.icon({
    iconUrl: 'triple.png',
    iconSize: [40, 40], // size of the icon
    iconAnchor: [20, 20], // point of the icon which will correspond to marker's location
});

export const getAddon = (map, options) => {
    if (!options.isAddon) return;
    switch (options.addonData.type.description) {
        case AddonType.RNG.description:
            return RangeExtra.addTo(map, { ...options.addonData, angle: options.angle });
        case AddonType.DR.description:
            return DRExtra.addTo(map, { ...options.addonData, angle: options.angle });
    }
}