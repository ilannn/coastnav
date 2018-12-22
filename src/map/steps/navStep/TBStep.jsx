import React, { Component } from 'react';
import NavStep from './NavStep';
import { Marker } from 'react-leaflet';
import L from 'leaflet';

export default class TBStep extends Component {

    constructor(props) {
        super(props);
        this.getMarkerPosition = this.getMarkerPosition.bind(this);
    }

    render() {
        let markerPosition = this.getMarkerPosition();
        return (
            <NavStep {...this.props}>
                <Marker position = {markerPosition}></Marker>;
            </NavStep>
        );
    }

    /**
     * Returns the marker's position.
     */
    getMarkerPosition() {
        // Return saved marker's positions, if exists.
        if (this.props.markerPosition) {
            return this.props.markerPosition;
        }
        // Otherwise, return calculated center.
        return L.polyline(this.props.positions).getCenter();
    }
}