import React, { Component } from 'react';
import { Input } from '@material-ui/core';
import StepService from '../../services/StepService';

class EditorFormContainer extends Component {

    state = {
        values: {
            positions: [
                {
                    lat: 0,
                    lng: 0
                },

                {
                    lat: 0,
                    lng: 0
                },
            ],
            angle: 0,
            length: 0
        },
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.positions !== prevState.positions) {
            let positions = nextProps.positions;
            let angle = StepService.calcAngle.apply(null,positions);
            let length = StepService.calcDistance.apply(null, positions).dist;
            return {
                values: {
                    ...prevState.values,
                    positions, angle, length
                }
            };
        }
        else return null;
    }

    // componentDidUpdate(prevProps, prevState) {
    //     if (prevProps.positions !== this.props.positions) {

    //         let positions = this.props.positions;
    //         let angle = StepService.calcAngle.apply(null,positions);
    //         let length = StepService.calcDistance.apply(null, positions).dist;

    //         this.setState({
    //             values: {
    //                 ...prevState.values,
    //                 positions, angle, length
    //             }
    //         });
    //     }
    // }

    handleCoordinatesChange(e) {
        let positions =
            this.state.values.positions ? this.state.values.positions : [];
        positions[e.target.id][e.target.name] = e.target.value;
        this.setState({
            values: {
                ...this.state.values,
                positions
            }
        });
    }
    handleAngleChange(e) {
        let angle = e.target.value;
        this.setState({
            values: {
                ...this.state.values,
                angle
            }
        });
    }
    handleLengthChange(e) {
        let length = e.target.value;
        this.setState({
            values: {
                ...this.state.values,
                length
            }
        });
    }
    render() {
        return (
            <form className="container">
                <CoordinatesInput
                    title={'From'}
                    id={'0'}
                    value={this.state.values.positions[0]}
                    handleChange={this.handleCoordinatesChange.bind(this)}
                />
                <CoordinatesInput
                    title={'To'}
                    id={'1'}
                    value={this.state.values.positions[1]}
                    handleChange={this.handleCoordinatesChange.bind(this)}
                />
                <AngleInput
                    title={'Angle'}
                    value={this.state.values.angle}
                    handleChange={this.handleAngleChange.bind(this)}
                />
                <LengthInput
                    title={'Length'}
                    value={this.state.values.length}
                    handleChange={this.handleLengthChange.bind(this)}
                />
            </form>
        );
    }
}

export default EditorFormContainer;


const CoordinatesInput = (props) => {
    return (
        <div className="form-group">
            <label htmlFor={props.name} className="form-label">{props.title}</label>
            <Input
                className="form-input"
                id={props.id}
                name={"lat"}
                type="number"
                value={props.value.lat}
                onChange={props.handleChange}
                placeholder="Lat"
            />
            <Input
                className="form-input"
                id={props.id}
                name={"lng"}
                type="number"
                value={props.value.lng}
                onChange={props.handleChange}
                placeholder="Lng"
            />
        </div>
    )
}

const AngleInput = (props) => {
    return (
        <div className="form-group">
            <label htmlFor={props.name} className="form-label">{props.title}</label>
            <Input
                className="form-input"
                type="number"
                value={props.value}
                onChange={props.handleChange}
                placeholder="°"
            />
        </div>
    )
}

const LengthInput = (props) => {
    return (
        <div className="form-group">
            <label htmlFor={props.name} className="form-label">{props.title}</label>
            <Input
                className="form-input"
                type="number"
                value={props.value}
                onChange={props.handleChange}
                placeholder="length"
            />
        </div>
    )
}
