import React, { Component } from 'react';
import ScenarioStep from './scenario-step/ScenarioStep';
import { Button } from '@material-ui/core';

import './Scenario.css';

class Scenario extends Component {

    constructor(props) {
        super(props);
        this.getStepsList = this.getStepsList.bind(this);
    }

    render() {
        let stepsList = this.getStepsList(this.props.steps);
        return (<div>
            <ul>
                {stepsList}
            </ul>
            <div className="footerButtons">
                <Button onClick={this.props.onNewStep}>Add</Button>
            </div>
        </div>);
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