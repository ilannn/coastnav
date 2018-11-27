import React, { Component } from 'react';
import './SimpleStep.css';

class SimpleStep extends Component {
    render() {
        return <line onClick={this.onClick}
            x1={this.props.top.x} y1={this.props.top.y}
            x2={this.props.end.x} y2={this.props.end.y} ></line>
    }

    onClick = (event) => {
        event.preventDefault();
        this.props.onClick(this.props.id);
    }
}

export default SimpleStep;