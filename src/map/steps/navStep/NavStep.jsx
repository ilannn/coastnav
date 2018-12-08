import React, { Component } from 'react';
import { Polyline, Marker } from 'react-leaflet';
import PropTypes from 'prop-types';

class NavStep extends Component {

    render() {
        let poliline = <Polyline onClick={this.onClick.bind(this)} {...this.props}></Polyline>;
        if (this.props.marker) {
            let marker = <Marker {...this.props.marker}></Marker>;
            return (<> {poliline} {marker} </>);
        } else { return (poliline); }
    }

    onClick = (event) => {
        // if not is edit mode
        if (this.props.type !== 0) {
            event.originalEvent.stopPropagation();
        }
        event.originalEvent.preventDefault();
        this.props.handleClick(this.props.id);
    }
}

NavStep.propTypes = {
    positions: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
    color: PropTypes.string,
    stroke: PropTypes.number,
    marker: PropTypes.object,
}

export default NavStep;
