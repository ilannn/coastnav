import React, { Component } from 'react';
import ScenarioStep from './scenario-step/ScenarioStep';
import { Button, List, ListItem } from '@material-ui/core';

import './Scenario.css';

class Scenario extends Component {

    constructor(props) {
        super(props);
        this.getStepsList = this.getStepsList.bind(this);
    }

    render() {
        let stepsList = this.getStepsList(this.props.steps);
        return (<div>
            <List>
                {stepsList}
            </List>
            <div className="footerButtons">
                <Button onClick={this.props.onNewStep}
                    variant="contained"
                    color="primary">Add</Button>
            </div>
        </div>);
    }

    getStepsList(steps) {
        return steps.map((step, index) => (
            <ListItem button key={step.id}>
                <ScenarioStep {...step} index={index} 
                    onClick={this.onStepClick.bind(this)}
                    onRemove={this.onStepRemove.bind(this)}></ScenarioStep>
            </ListItem>
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
    
    onStepRemove(stepId) {
        let step = this.props.steps.find((step) => {
            return step.id === stepId
        });
        if (step) {
            this.props.onRemoveStep(step.id);
        }

    }
}

export default Scenario;