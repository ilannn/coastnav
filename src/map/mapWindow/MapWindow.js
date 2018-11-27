import React, { Component } from 'react';

class MapWindow extends Component {

    render() {
        return <div>
            {/* <img src="https://developers.google.com/maps/documentation/urls/images/map-no-params.png" alt="" /> */}
            <span className="stepsContainer">
                {this.props.children}
            </span>
        </div>
    }
}

export default MapWindow;