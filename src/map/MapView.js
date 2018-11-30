import React, { Component } from 'react';
import MapWindow from './mapWindow/MapWindow';
import SimpleStep from './steps/simpleStep/SimpleStep';
import MouseInfo from './mouse/MouseInfo';
import ReactCursorPosition from 'react-cursor-position';

import './MapView.css';

class MapView extends Component {
    render() {
        return <section className="MapViewContainer">
            <ReactCursorPosition>
                <MapWindow>
                    <svg height="800px" width="800px">
                        {this.createSteps()}
                    </svg>
                </MapWindow>
                <MouseInfo></MouseInfo>
            </ReactCursorPosition>
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