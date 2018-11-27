export default class StepService {
    constructor() {
        this.id = 1;
    }

    getSteps = (limit) => {
        return [
            { id: this.id++, type: 1, top: { x: 0, y: 0 }, end: { x: 200, y: 200 }, length: 10 },
            { id: this.id++, type: 2, top: { x: 110, y: 100 }, end: { x: 200, y: 200 }, length: 10 }
        ]
    }

    getNewStep = () => {
        return { id: this.id++, type: 1, top: { x: 0, y: 0 }, end: { x: 0, y: 0 }, length: 0 }
    }
}