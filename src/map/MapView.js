import React, { Component } from 'react';
import SimpleStep from './steps/simpleStep/SimpleStep';
import MouseInfo from './mouse/MouseInfo';
import ReactCursorPosition from 'react-cursor-position';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';

import './MapView.css';
import NavStep from './steps/navStep/NavStep';
const center = [51.505, -0.09]
class MapView extends Component {
    state = {
        lat: 51.505,
        lng: -0.09,
        zoom: 13,
    }
    render() {
        const position = [this.state.lat, this.state.lng]
        return (<section className="MapViewContainer">
            {/* <ReactCursorPosition>
                    <svg height="800px" width="800px"
                        onClick={this.onDrawingClick.bind(this)}
                        onMouseMove={this.onDrawingMove.bind(this)}>
                        {this.createSteps()}
                    </svg>
                    <MouseInfo></MouseInfo>
                </ReactCursorPosition> */}
            <Map id="map" key="maymap"
                ref="map" center={center} zoom={13} onClick={this.onDrawingClick.bind(this)}>

                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {this.getNavSteps()}
            </Map>
        </section>)
    }

    getNavSteps = () => {
        let steps = [];
        if (this.props.steps) {
            this.props.steps.forEach(navStep => {
                steps.push(<NavStep {...navStep} key={navStep.id} onClick={this.props.handleStepClick}></NavStep>);
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