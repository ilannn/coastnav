import React, { Component } from 'react';
import ScenarioStep from './scenario-step/ScenarioStep';

class Scenario extends Component {

    constructor(props) {
        super(props);
        this.getStepsList = this.getStepsList.bind(this);
    }

    render() {
        let stepsList = this.getStepsList(this.props.steps);
        return (<ul>
            {stepsList}
        </ul>);
    }

    getStepsList(steps) {
        return steps.map((step, index) => (
            <li key={step.id} style={{ backgroundColor: 'blue' }}>
                <ScenarioStep {...step} index={index} onClick={this.onStepClick.bind(this)}></ScenarioStep>
            </li>
        ))
    }

    onStepClick(stepId) {
        let step = this.props.steps.find((step) => {
            return step.id === stepId
        });
        if (step) {
            this.props.onStepClick(step);
        }
    }
}

export default Scenario;