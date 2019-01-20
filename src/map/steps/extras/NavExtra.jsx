import React, { Component } from 'react';
import { Marker } from 'react-leaflet';
import PropTypes from 'prop-types';

class NavExtra extends Component {

    render() {
        return (<span>
            <Marker onClick={this.onClick.bind(this)} {...this.props}></Marker>
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

NavExtra.propTypes = {
    positions: PropTypes.arrayOf(PropTypes.object),
}

export default NavExtra;
