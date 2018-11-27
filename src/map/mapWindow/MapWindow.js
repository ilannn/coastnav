import React, { Component } from 'react';

class MapWindow extends Component {

    render() {
        return <div style={{ backgroundImage: "" }}>
            {/* <img src="" alt="" /> */}
            <span className="stepsContainer">
                {this.props.children}
            </span>
        </div>
    }
}

export default MapWindow;