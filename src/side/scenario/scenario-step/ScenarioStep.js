import React, { Component } from 'react';
import { ListItemText } from '@material-ui/core';

export default class ScenarioStep extends Component {
    render() {
        return (
            <ListItemText onClick={this.onClick.bind(this)}
                primary={`(${this.props.top.x}, ${this.props.top.y}) > (${this.props.end.x}, ${this.props.end.y})`}>
            </ListItemText>
        );
    }

    onClick(event) {
        event.preventDefault();
        this.props.onClick(this.props.id);
    }
}