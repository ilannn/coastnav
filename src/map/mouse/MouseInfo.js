import React, { Component } from 'react';

class MouseInfo extends Component {
    render() {        
        return (<small style={{ 
                position: "absolute", 
                left: 100, 
                top: 150}}>
                {/* left: this.props.position.x + 10, 
                top: this.props.position.y + 15}}> */}
            ({this.props.lat} , {this.props.lng})
        </small>);
    }
}

export default MouseInfo;