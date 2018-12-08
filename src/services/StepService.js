export default class StepService {
    constructor() {
        this.id = 1;
    }

    getSteps = (limit) => {
        return [
            {
                id: this.id++, type: 1,
                positions: [[51.505, -0.09], [51.510, -0.095]],
                color: "red",
                stroke: 20,
                marker: {
                    position: [51.505, -0.095]
                }
            },
            {
                id: this.id++, type: 2,
                positions: [[51.505, -0.09], [51.52, -0.1]],
                color: "red",
                stroke: 20,
                marker: {
                    position: [51.56, -0.092]
                }
            }
        ]
    }

    getNewStep = (lat = 0, lng = 0) => {
        return {
            id: this.id++, type: 2,
            positions: [[lat, lng], [lat, lng]],
            color: "red",
            stroke: 20,
            marker: undefined
        }
    }

    getNewStepAt = (x, y) => {
        let latlng = [0,0];
        // calc latlng by projection
        return this.getNewStep([...latlng]);
    }
}