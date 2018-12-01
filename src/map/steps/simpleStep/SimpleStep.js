import React, { Component } from 'react';
import './SimpleStep.css';

class SimpleStep extends Component {

    render() {
        return <line className={`line-${this.props.type}`} onClick={this.onClick}
            x1={this.props.top.x} y1={this.props.top.y}
            x2={this.props.end.x} y2={this.props.end.y}
            style={this.props.style} ></line>
    }

    onClick = (event) => {
        // if not is edit mode
        if (this.props.type !== 0) {
            event.stopPropagation();
        }
        event.preventDefault();
        this.props.onClick(this.props.id);
    }
}

export default SimpleStep;
