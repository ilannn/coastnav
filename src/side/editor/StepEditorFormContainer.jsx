import React, { PureComponent } from 'react';
import './StepEditorFormContainer.css';
import { Input, Button, Select, InputLabel, MenuItem } from '@material-ui/core';
import { MuiPickersUtilsProvider, TimePicker } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import { Slider } from '@material-ui/lab';
import GeoService from '../../services/GeoService';
import { StepType } from '../../models/steps';
import _ from 'lodash';

class StepEditorFormContainer extends PureComponent {
    state = {
        values: this.getValuesFromProps(this.props),
    }

    getValuesFromProps(props) {
        return {
            positions: props.positions,
            type: props.type.description,
            angle: GeoService.calcAngle.apply(null, props.positions),
            length: Number(GeoService.calcDistance.apply(null, props.positions).dist),
            marker: props.marker ? props.marker.percentage : 50,
            time: props.time,
            isAddon: !!props.addon,
            addonData: props.addon,
        }
    }

    /**
     * Restart editor's state when selected a new step
     *  (passed threw props) OR when step changes (???)
     */
    componentDidUpdate(prevProps) {
        if (this.props.id !== prevProps.id
            || !_.isEqual(this.props.marker, prevProps.marker)
            || !_.isEqual(this.props.addon, prevProps.addon)
            || this.props.positions !== prevProps.positions) {
            this.setState({
                ...this.state,
                values: this.getValuesFromProps(this.props),
            });
        }
    }

    handleCoordinatesChange = (e) => {
        let positions =
            this.state.values.positions ? this.state.values.positions : [];
        try { 
            positions[e.target.id][e.target.name] = 
                Number(GeoService.unformatCoordinate(e.target.value)); 
        }
        catch { console.warn("User entered wrong coord format: ", e.target.value); }
        let angle = GeoService.calcAngle(...positions);
        let length = Number(GeoService.calcDistance(...positions).dist);
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
            GeoService.calcNewEnding(
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
            GeoService.calcNewEnding(
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
        let time;
        if (type === "GUIDELINE") { time = null; }
        else {
            time = this.state.values.time
                ? this.state.values.time : new Date();
        }
        this.setState({
            values: {
                ...this.state.values,
                type, time
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

    handleTimeChange = (m) => {
        let time = m.toDate();
        this.setState({
            values: {
                ...this.state.values,
                time
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
        let position = GeoService.calcNewMarkerPosition(
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
                <TypeInput
                    title={'Type'}
                    value={this.state.values.type}
                    handleChange={this.handleTypeChange} />
                <AngleInput
                    title={'Degree'}
                    value={this.state.values.angle}
                    handleChange={this.handleAngleChange}
                />
                <LengthInput
                    title={'Distance'}
                    value={this.state.values.length}
                    handleChange={this.handleLengthChange}
                />
                {this.state.values.time &&
                    <TimeInput
                        title={'Time'}
                        value={this.state.values.time}
                        handleChange={this.handleTimeChange} />}
                {this.state.values.marker &&
                    <MarkerInput
                        title={'Marker'}
                        value={this.state.values.marker}
                        handleChange={this.handleMarkerChange} />}
                <div className="footerButtons">
                    <Button type="submit" variant="contained" color="primary">Save</Button>
                    <Button onClick={this.props.onDelete} variant="contained">Delete</Button>
                </div>
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

export default StepEditorFormContainer;

const CoordinatesInput = (props) => {
    return (
        <div className="form-group">
            <InputLabel htmlFor={props.name}>{props.title}</InputLabel>
            <span>
                <Input
                    className="form-input"
                    id={props.id}
                    name={"lat"}
                    type="string"
                    value={GeoService.formatCoordinate(props.value.lat)}
                    onChange={props.handleChange}
                    placeholder="Lat"
                />
                <Input
                    className="form-input"
                    id={props.id}
                    name={"lng"}
                    type="string"
                    value={GeoService.formatCoordinate(props.value.lng)}
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

const TimeInput = (props) => {
    return (
        <div className="form-group">
            <InputLabel htmlFor={props.name}>{props.title}</InputLabel>
            <MuiPickersUtilsProvider utils={MomentUtils}>
                <TimePicker
                    className="form-input"
                    ampm={false}
                    value={props.value}
                    onChange={props.handleChange}
                />
            </MuiPickersUtilsProvider>
        </div>
    )
}