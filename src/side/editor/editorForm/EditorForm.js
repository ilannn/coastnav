import React, { Component } from 'react';
import { Field, withFormik } from 'formik';
import { isEqual } from 'lodash';
import Button from '@material-ui/core/Button';
import { Input } from '@material-ui/core';

import './EditorForm.css';
import StepService from '../../../services/StepService';

const formikEnhancer = withFormik({
    mapPropsToValues: props => {
        let values = {
            positions: [...props.positions],
            angle: StepService.calcAngle(...props.positions),
            length: StepService.calcDistance(...props.positions).dist,
        };
        return values;
    },
    handleSubmit: (values, bag) => {
        setTimeout(function () { // Mock async BE API call
            bag.setSubmitting(false);
            bag.props.updateStep({
                positions: values.positions,
                angle: values.angle,
                length: values.length
            });
        }, 0);
    },
    displayName: 'MyForm',
});

class MyForm extends Component {

    componentWillUpdate(nextProps) {
        if (!isEqual(nextProps.positions, this.props.positions)) {
            this.props.resetForm(nextProps);
        }
    }

    render() {
        return (
            <form onSubmit={this.props.handleSubmit}>
                <div className="editorBundle">
                    <label>From</label>
                    <div className="coordinatesInputs">
                        <Field
                            render={() => (
                                <Input type="number"
                                    name="positions[0].lat"
                                    placeholder="Lat"
                                    maxLength="10"
                                    value={this.props.values.positions[0].lat}
                                    onChange={this.props.handleChange}></Input>
                            )}
                        />
                        <Field
                            render={() => (
                                <Input type="number"
                                    name="positions[0].lng"
                                    placeholder="Lng"
                                    maxLength="10"
                                    value={this.props.values.positions[0].lng}
                                    onChange={this.props.handleChange}></Input>
                            )}
                        />
                    </div>
                    <label>To</label>
                    <div className="coordinatesInputs">
                        <Field
                            render={() => (
                                <Input type="number"
                                    name="positions[1].lat"
                                    placeholder="Lat"
                                    maxLength="10"
                                    value={this.props.values.positions[1].lat}
                                    onChange={this.props.handleChange}></Input>
                            )}
                        />
                        <Field
                            render={() => (
                                <Input type="number"
                                    name="positions[1].lng"
                                    placeholder="Lng"
                                    maxLength="10"
                                    value={this.props.values.positions[1].lng}
                                    onChange={this.props.handleChange}></Input>
                            )}
                        />
                    </div>
                    <label>Angle</label>
                    <Field
                        render={() => {
                            console.log("render", `${this.props.values && this.props.values.angle} || ${this.props.values.values && this.props.values.values.angle}`);
                            return (<Input type="number"
                                name="angle"
                                placeholder="°"
                                maxLength="5"
                                value={this.props.values.angle || this.props.values.values.angle}
                                onChange={this.props.handleChange}></Input>)

                        }}
                    />
                    <label>Length</label>
                    <Field
                        render={() => {
                            return (<Input type="number"
                                name="length"
                                placeholder="Length"
                                value={this.props.values.length || this.props.values.values.length}
                                onChange={this.props.handleChange}></Input>)

                        }}
                    />
                </div>

                <div className="footerButtons">
                    <Field
                        name="i"
                        render={({ field /* _form */ }) => (
                            <Button
                                type="button"
                                onClick={this.props.handleReset}
                                disabled={
                                    !this.props.dirty || this.props.isSubmitting
                                }
                            >Reset</Button>
                        )}
                    />
                    <Field
                        name="i"
                        render={({ field /* _form */ }) => (
                            <Button
                                type="button"
                                onClick={this.props.onDelete}
                            >Delete</Button>
                        )}
                    />
                    <Field
                        name="i"
                        render={({ field /* _form */ }) => (
                            <Button type="submit" variant="contained" color="primary">Save</Button>
                        )}
                    />
                </div>
            </form>
        );
    }
}

const MyEnhancedForm = formikEnhancer(MyForm);

export default MyEnhancedForm;
