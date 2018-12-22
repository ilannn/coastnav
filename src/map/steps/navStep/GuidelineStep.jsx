import React, { Component } from 'react';
import NavStep from './NavStep';

const guidelineProps = {
    color: 'grey',
    dashArray: '4',
}
export default class GuidelineStep extends Component {
    render() {
        return (
            <NavStep {...this.props} {...guidelineProps}></NavStep>
        );
    }
}