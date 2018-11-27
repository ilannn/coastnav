import React, { Component } from 'react';

class MapWindow extends Component {

    render() {
        return <div style={{ backgroundImage: "https://developers.google.com/maps/documentation/urls/images/map-no-params.png" }}>
            {/* <img src="" alt="" /> */}
            <span className="stepsContainer">
                {this.props.children}
            </span>
        </div>
    }
}

export default MapWindow;