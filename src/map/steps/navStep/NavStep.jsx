import React, { Component } from 'react';
import { Polyline, Marker } from 'react-leaflet';
import PropTypes from 'prop-types';

class NavStep extends Component {

    render() {
        return (<span>
            <Polyline onClick={this.onClick.bind(this)} {...this.props}></Polyline>
            {this.props.children}
        </span>
        );
    }

    onClick = (event) => {
        // if not is edit mode
        if (this.props.type !== 0) {
            event.originalEvent.view.L.DomEvent.stopPropagation(event);
        }
        // event.originalEvent.preventDefault();
        this.props.handleClick(this.props.id);
    }
}

NavStep.propTypes = {
    positions: PropTypes.arrayOf(PropTypes.object),
    color: PropTypes.string,
    stroke: PropTypes.number,
    marker: PropTypes.object,
}

export default NavStep;
