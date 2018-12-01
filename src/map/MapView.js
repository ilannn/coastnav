import React, { Component } from 'react';
import SimpleStep from './steps/simpleStep/SimpleStep';
import MouseInfo from './mouse/MouseInfo';
import ReactCursorPosition from 'react-cursor-position';

import './MapView.css';

class MapView extends Component {
    render() {
        return <section className="MapViewContainer">
            <ReactCursorPosition>
                <svg height="800px" width="800px" 
                    onClick={this.onDrawingClick.bind(this)}
                    onMouseMove={this.onDrawingMove.bind(this)}>
                    {this.createSteps()}
                </svg>
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

    onDrawingClick(event) {
        event.preventDefault();
        event.stopPropagation();
        this.props.onDrawingClick(event);
    }
    onDrawingMove(event) {
        event.preventDefault();
        event.stopPropagation();
        this.props.onDrawingMove(event);
    }
}

export default MapView;