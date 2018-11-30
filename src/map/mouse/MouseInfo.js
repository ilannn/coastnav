import React, { Component } from 'react';

class MouseInfo extends Component {
    render() {
        return (<small style={{ 
                position: "absolute", 
                left: this.props.position.x + 10, 
                top: this.props.position.y + 15, 
                display: this.props.isActive ? '' : 'none' }}>
            ({this.props.position.x} , {this.props.position.y})
        </small>);
    }
}

export default MouseInfo;