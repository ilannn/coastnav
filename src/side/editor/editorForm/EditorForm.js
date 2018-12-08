import React, { Component } from 'react';
import { Field, withFormik } from 'formik';
import { isEqual } from 'lodash';
import Button from '@material-ui/core/Button';

import './EditorForm.css';
import { Input } from '@material-ui/core';

const formikEnhancer = withFormik({
    mapPropsToValues: props => {
        return { positions: [...props.positions] }
    },
    //mapValuesToPayload: x => x,
    handleSubmit: (updatedStep, bag) => {
        setTimeout(function () {
            // alert(JSON.stringify(updatedStep, null, 2));
            bag.setSubmitting(false);
            if (updatedStep.values) delete updatedStep['values'];

            bag.props.updateStep(updatedStep);
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
                    <div>
                        <Field
                            render={() => (
                                <Input type="number"
                                    name="positions[0][0]"
                                    placeholder="Lat"
                                    maxLength="9"
                                    value={this.props.values.positions[0][0]}
                                    onChange={this.props.handleChange}></Input>
                            )}
                        />
                        <Field
                            render={() => (
                                <Input type="number"
                                    name="positions[0][1]"
                                    placeholder="Lng"
                                    maxLength="9"
                                    value={this.props.values.positions[0][1]}
                                    onChange={this.props.handleChange}></Input>
                            )}
                        />
                    </div>
                </div>
                <div className="coordinatesBundle">
                    <label>To</label>
                    <div>
                        <Field
                            render={() => (
                                <Input type="number"
                                    name="positions[1][0]"
                                    placeholder="Lat"
                                    value={this.props.values.positions[1][0]}
                                    onChange={this.props.handleChange}></Input>
                            )}
                        />
                        <Field
                            render={() => (
                                <Input type="number"
                                    name="positions[1][1]"
                                    placeholder="Lng"
                                    value={this.props.values.positions[1][1]}
                                    onChange={this.props.handleChange}></Input>
                            )}
                        />
                    </div>
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
