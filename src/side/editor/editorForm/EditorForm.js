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
        };
        return values;
    },
    handleSubmit: (updatedStep, bag) => {
        setTimeout(function () { // Mock BE API call
            bag.setSubmitting(false);
            bag.props.updateStep({
                positions: updatedStep.positions
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
                <div className="coordinatesBundle">
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
                </div>
                <div className="coordinatesBundle">
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
                </div>
                {/* <div>
                    <label>Angle</label>
                    <Field
                        render={() => (
                            <Input type="number"
                                name="angle"
                                placeholder="°"
                                maxLength="5"
                                value={this.props.values.angle}
                                onChange={this.props.handleChange}></Input>
                        )}
                    />
                </div> */}

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
