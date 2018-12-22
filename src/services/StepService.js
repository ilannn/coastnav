export default class StepService {
    constructor() {
        this.id = 1;
    }

    getSteps = (limit) => {
        return [
            {
                id: this.id++, type: 1,
                positions: [[32.374, 35.116], [32.4, 35.2]],
                color: "black",
                stroke: 20,
                marker: {
                }
            },
            {
                id: this.id++, type: 2,
                positions: [[32.4, 35.3], [32.2, 35.2]],
                color: "black",
                stroke: 20,
                marker: {
                }
            }
        ]
    }

    getNewStep = (lat = 0, lng = 0) => {
        return {
            id: this.id++, type: 2,
            positions: [[lat, lng], [lat, lng]],
            color: "black",
            type: 0,
            stroke: 20,
            marker: undefined
        }
    }

    getNewStepAt = (x, y) => {
        let latlng = [0,0];
        // calc latlng by projection
        return this.getNewStep([...latlng]);
    }

    static calcAngle = function (points, direction) {
        let p1 = points[0];
        let p2 = points[1];
        var lat1 = p1.lat / 180 * Math.PI;
        var lat2 = p2.lat / 180 * Math.PI;
        var lng1 = p1.lng / 180 * Math.PI;
        var lng2 = p2.lng / 180 * Math.PI;
        var y = Math.sin(lng2-lng1) * Math.cos(lat2);
        var x = Math.cos(lat1)*Math.sin(lat2) - Math.sin(lat1)*Math.cos(lat2)*Math.cos(lng2-lng1);
        if (direction === "inbound") {
            var brng = (Math.atan2(y, x) * 180 / Math.PI + 180).toFixed(0);
        } else {
            var brng = (Math.atan2(y, x) * 180 / Math.PI + 360).toFixed(0);
        }
        return (brng % 360);
    }

    static calcDistance = function (points) {
        let unit = "M";
        let dist = points[0].distanceTo(points[1]);
        if (dist >= 1609344) {
            dist = (dist/1609.344).toFixed(0);
        } else if (dist >= 160934.4) {
            dist = (dist/1609.344).toFixed(1);
            // don't use 3 decimal digits, cause especially in countries using the "." as thousands separator a number could optically be confused (e.g. "1.234mi": is it 1234mi or 1,234mi ?)
        } else if (dist >= 1609.344) {
            dist = (dist/1609.344).toFixed(2);
        } else {
            dist = (dist/0.3048).toFixed(0);
            unit = "F";
        }
        return { dist, unit };
    }
}