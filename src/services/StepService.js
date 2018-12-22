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
}