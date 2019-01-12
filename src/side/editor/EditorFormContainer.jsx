import React, { PureComponent } from 'react';
import './EditorFormContainer.css';
import { Input, Button, Select, InputLabel, MenuItem } from '@material-ui/core';
import { Slider } from '@material-ui/lab';
import StepService from '../../services/StepService';
import { StepType } from '../../models/steps';
import _ from 'lodash';

class EditorFormContainer extends PureComponent {
    state = {
        values: {
            positions: this.props.positions,
            type: this.props.type.description,
            angle: StepService.calcAngle.apply(null, this.props.positions),
            length: Number(StepService.calcDistance.apply(null, this.props.positions).dist),
            marker: this.props.marker ? this.props.marker.percentage : 50,
        },
    }

    /**
     * Restart editor's state when selected a new step
     *  (passed threw props) OR when step changes (???)
     */
    componentDidUpdate(prevProps) {
        if (this.props.id !== prevProps.id 
            || !_.isEqual(this.props.marker, prevProps.marker)
            || this.props.positions !== prevProps.positions) {
            let positions = this.props.positions;
            let angle = StepService.calcAngle.apply(null, positions);
            let length = Number(StepService.calcDistance.apply(null, positions).dist);
            let type = this.props.type.description;
            let marker = this.props.marker ? this.props.marker.percentage : null;
            this.setState({
                ...this.state,
                values: {
                    positions, angle, length, type, marker
                }
            });
        }
    }

    handleCoordinatesChange = (e) => {
        let positions =
            this.state.values.positions ? this.state.values.positions : [];
        positions[e.target.id][e.target.name] = Number(e.target.value);
        let angle = StepService.calcAngle(...positions);
        let length = Number(StepService.calcDistance(...positions).dist);
        this.setState({
            values: {
                ...this.state.values,
                positions, angle, length
            }
        });
    }
    handleAngleChange = (e) => {
        let angle = Number(e.target.value);
        let positions = [
            this.state.values.positions[0],
            StepService.calcNewEnding(
                this.state.values.positions[0],
                this.state.values.length,
                angle
            )
        ];
        this.setState({
            values: {
                ...this.state.values,
                angle, positions
            }
        });
    }
    handleLengthChange = (e) => {
        let length = Number(e.target.value);
        let positions = [
            this.state.values.positions[0],
            StepService.calcNewEnding(
                this.state.values.positions[0],
                length,
                this.state.values.angle
            )
        ];
        this.setState({
            values: {
                ...this.state.values,
                length, positions
            }
        });
    }
    handleTypeChange = (e) => {
        let type = e.target.value;
        let marker;
        if (type === "GUIDELINE") { marker = null }
        else {
            marker = this.state.values.marker 
                ? this.state.values.marker : 50;
        }
        this.setState({
            values: {
                ...this.state.values,
                type, marker,
            }
        });
    }
    handleMarkerChange = (e, value) => {
        let marker = Number(value);
        this.setState({
            values: {
                ...this.state.values,
                marker
            }
        });
    }

    /**
     * Get updated marker values using given position & percentage
     * or state's values (50 as percentage fallback).
     */
    getUpdatedMarker = (positions, percentage) => {
        if (!positions) {
            positions = this.state.values.positions;
        }
        if (!percentage) {
            percentage = this.state.values.marker ?
                this.state.values.marker : 50;
        }
        let position = StepService.calcNewMarkerPosition(
            positions[0],
            positions[1],
            percentage
        );
        return {
            position, percentage
        }
    }

    render() {
        return (
            <form className="container"
                onSubmit={this.handleSubmit}>
                <CoordinatesInput
                    title={'From'}
                    id={'0'}
                    value={this.state.values.positions[0]}
                    handleChange={this.handleCoordinatesChange}
                />
                <CoordinatesInput
                    title={'To'}
                    id={'1'}
                    value={this.state.values.positions[1]}
                    handleChange={this.handleCoordinatesChange}
                />
                <AngleInput
                    title={'Angle'}
                    value={this.state.values.angle}
                    handleChange={this.handleAngleChange}
                />
                <LengthInput
                    title={'Length'}
                    value={this.state.values.length}
                    handleChange={this.handleLengthChange}
                />
                <TypeInput
                    title={'Step Type'}
                    value={this.state.values.type}
                    handleChange={this.handleTypeChange} />
                {this.state.values.marker &&
                    <MarkerInput
                        title={'Marker'}
                        value={this.state.values.marker}
                        handleChange={this.handleMarkerChange} />}
                <Button type="submit" variant="contained" color="primary">Save</Button>
                <Button onClick={this.props.onDelete} variant="contained">Delete</Button>
            </form >
        );
    }

    handleSubmit = (e) => {
        e.preventDefault();
        let values = { ...this.state.values };
        values.type = StepType[values.type];
        values.marker = this.getUpdatedMarker(values.positions, values.marker);
        this.props.onSave(values);
    }
}

export default EditorFormContainer;


const CoordinatesInput = (props) => {
    return (
        <div className="form-group">
            <InputLabel htmlFor={props.name}>{props.title}</InputLabel>
            <span>
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
            </span>
        </div>
    )
}

const AngleInput = (props) => {
    return (
        <div className="form-group">
            <InputLabel htmlFor={props.name}>{props.title}</InputLabel>
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
            <InputLabel htmlFor={props.name}>{props.title}</InputLabel>
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

const TypeInput = (props) => {
    return (
        <div className="form-group">
            <InputLabel htmlFor={props.name}>{props.title}</InputLabel>
            <Select
                value={props.value}
                onChange={props.handleChange}
                inputProps={{
                    name: 'type',
                    id: 'type',
                }}
            >
                <MenuItem value={"GUIDELINE"}>Guide Line</MenuItem>
                <MenuItem value={"TB"}>TB</MenuItem>
                <MenuItem value={"COG"}>COG</MenuItem>
                <MenuItem value={"CRNT"}>CRNT</MenuItem>
                <MenuItem value={"TC"}>TC</MenuItem>
            </Select>
        </div>
    )
}

const MarkerInput = (props) => {
    return (
        <div className="form-group">
            <InputLabel htmlFor={props.name}>{props.title}</InputLabel>
            <Slider
                className="form-input"
                type="number"
                value={props.value}
                onChange={props.handleChange}
            />
        </div>
    )
}