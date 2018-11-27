import React, { Component } from 'react';

export default class ScenarioStep extends Component {
    render() {
        return (
            <span onClick={this.onClick.bind(this)}>
                <small>{this.props.index} - </small>
                <label>{`${this.props.top.x}, ${this.props.top.y}`}</label>
                <span> | </span>
                <label>{`${this.props.end.x}, ${this.props.end.y}`}</label>
            </span>
        );
    }

    onClick(event) {
        event.preventDefault();
        this.props.onClick(this.props.id);
    }
}