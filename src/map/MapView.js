import React, { Component } from 'react';
import './MapView.css';
import MapWindow from './mapWindow/MapWindow';
import SimpleStep from './steps/simpleStep/SimpleStep';

class MapView extends Component {
    render() {
        return <section className="MapViewContainer">
            <MapWindow>
                <svg height="800px" width="800px">
                    {this.createSteps()}
                </svg>
            </MapWindow>
        </section>
    }

    createSteps = () => {
        let steps = [];
        if (this.props.steps) {
            this.props.steps.forEach(step => {
                steps.push(<SimpleStep {...step} key={step.id} onClick={this.props.handleStepClick}></SimpleStep>);
            });
        }

        return steps;
    }
}

export default MapView;