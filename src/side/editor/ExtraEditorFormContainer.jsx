import React, { PureComponent } from 'react';
import './StepEditorFormContainer.css';
import { Input, Button, Select, InputLabel, MenuItem } from '@material-ui/core';
import { MuiPickersUtilsProvider, TimePicker } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import GeoService from '../../services/GeoService';
import { ExtraType } from '../../models/extras';

class StepEditorFormContainer extends PureComponent {
    state = {
        values: {
            position: this.props.position,
            type: this.props.type.description,
            length: this.props.length,
            time: this.props.time,
        },
    }

    /**
     * Restart editor's state when selected a new step
     *  (passed threw props) OR when step changes (???)
     */
    componentDidUpdate(prevProps) {
        if (this.props.id !== prevProps.id
            || this.props.length !== prevProps.length
            || this.props.position !== prevProps.position) {
            let position = this.props.position;
            let length = this.props.length;
            let type = this.props.type.description;
            let time = this.props.time;
            this.setState({
                ...this.state,
                values: {
                    position, length, type, time
                }
            });
        }
    }

    handleCoordinatesChange = (e) => {
        let position = this.state.values.position;
        try { 
            position[e.target.name] = Number(GeoService.unformatCoordinate(e.target.value)); 
        }
        catch { console.warn("User entered wrong coord format: ", e.target.value); }
        this.setState({
            values: {
                ...this.state.values,
                position,
            }
        });
    }
    handleLengthChange = (e) => {
        let length = Number(e.target.value);
        this.setState({
            values: {
                ...this.state.values,
                length
            }
        });
    }
    handleTypeChange = (e) => {
        let type = e.target.value;
        let length;
        if (type === "RNG" || type === "R")  {
            length = this.state.values.length
                ? this.state.values.length
                : -1;
        } else {
            length = null;
        }
        this.setState({
            values: {
                ...this.state.values,
                type, length
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

    render() {
        return (
            <form className="container"
                onSubmit={this.handleSubmit}>
                <CoordinatesInput
                    title={'Position'}
                    value={this.state.values.position}
                    handleChange={this.handleCoordinatesChange}
                />
                <TypeInput
                    title={'Type'}
                    value={this.state.values.type}
                    handleChange={this.handleTypeChange} />
                <TimeInput
                    title={'Time'}
                    value={this.state.values.time}
                    handleChange={this.handleTimeChange} />
                {(this.state.values.length || this.state.values.length === 0) 
                    && <LengthInput
                            title={'Length'}
                            value={this.state.values.length}
                            handleChange={this.handleLengthChange} />}
                
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
        values.type = ExtraType[values.type];
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
                <MenuItem value={"RNG"}>Range</MenuItem>
                <MenuItem value={"DR"}>DR</MenuItem>
                <MenuItem value={"FIX"}>Fix</MenuItem>
                <MenuItem value={"R"}>Radius</MenuItem>
            </Select>
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