import React, { Component } from 'react';
/* import SimpleStep from './steps/simpleStep/SimpleStep';
import ReactCursorPosition from 'react-cursor-position'; */
import { Map, TileLayer } from 'react-leaflet';
import NavStep from './steps/navStep/NavStep';
import MouseInfo from './mouse/MouseInfo';

import './MapView.css';

const center = [51.505, -0.09]

class MapView extends Component {

    constructor(props) {
        super(props);
        this.escFunction = this.escFunction.bind(this);
    }

    leafletMap = null;

    setLeafletMapRef = map => (this.leafletMap = map && map.leafletElement);

    componentDidMount() {
        document.addEventListener("keydown", this.escFunction, false);
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", this.escFunction, false);
    }
    componentDidUpdate() {
        this.leafletMap.invalidateSize();
    }

    render() {
        return (<section className="MapViewContainer">
            <Map id="map" key="mymap"
                ref={this.setLeafletMapRef}
                center={center} zoom={13}
                onClick={this.onDrawingClick.bind(this)}
                onMouseMove={this.onDrawingMove.bind(this)}>

                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {this.getNavSteps()}
            </Map>
            {/* <MouseInfo {...this.props.mouseInfo}></MouseInfo> */}
        </section>)
    }

    getNavSteps() {
        let steps = [];
        if (this.props.steps) {
            this.props.steps.forEach(navStep => {
                steps.push(<NavStep {...navStep} key={navStep.id}
                    handleClick={this.props.handleStepClick}></NavStep>);
            });
        }
        return steps;
    }

    escFunction(event) {
        if (event.keyCode === 27) {
            this.props.handleEscPress();
        }
    }

    onDrawingClick(event) {
        event.originalEvent.preventDefault();
        event.originalEvent.stopPropagation();
        this.props.onDrawingClick(event);
    }
    onDrawingMove(event) {
        event.originalEvent.preventDefault();
        event.originalEvent.stopPropagation();
        this.props.onDrawingMove(event);
    }
}

export default MapView;