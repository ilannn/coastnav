import React, { Component } from 'react';
import { Input, Button } from '@material-ui/core';
import StepService from '../../services/StepService';
import _ from 'lodash';

class EditorFormContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
                type: null,
                angle: 0,
                length: 0,
                marker: {

                }
            },
        }
    }


    static getDerivedStateFromProps = (nextProps, prevState) => {
        let newState = { ...prevState };
        if (nextProps.positions !== prevState.values.positions) {
            let positions = nextProps.positions;
            let angle = StepService.calcAngle.apply(null, positions);
            let length = StepService.calcDistance.apply(null, positions).dist;
            Object.assign(newState, {
                values: {
                    positions, angle, length
                }
            });
        }
        if (_.isEqual(nextProps.type !== prevState.type)) {
            // Perform step type update (marker metadata)
            let type = nextProps.type;
            let marker = nextProps.marker;
            Object.assign(newState, {
                values: {
                    type, marker
                }
            });
        }
        else if (_.isEqual(nextProps.marker !== prevState.marker)) {
            // Perform marker update
        }
        return newState;
    }

    shouldComponentUpdate(nextProps, nextState) {
        console.log("nextProps", nextProps);
        console.log("this.props", this.props);
        console.log("nextState", nextState);
        console.log("this.state", this.state);
        return true;
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
        positions[e.target.id][e.target.name] = Number(e.target.value);
        this.setState({
            values: {
                ...this.state.values,
                positions
            }
        });
    }
    handleAngleChange(e) {
        let angle = Number(e.target.value);
        this.setState({
            values: {
                ...this.state.values,
                angle
            }
        });
    }
    handleLengthChange(e) {
        let length = Number(e.target.value);
        this.setState({
            values: {
                ...this.state.values,
                length
            }
        });
    }

    render() {
        return (
            <form className="container"
                onSubmit={this.handleSubmit}>
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
                {/* <MarkerInput></MarkerInput> */}
                <Button type="submit" variant="contained" color="primary">Save</Button>
                <Button onClick={this.props.onDelete} variant="contained">Delete</Button>
            </form >
        );
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.onSave(this.state.values);
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

const MarkerInput = (props) => {
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
