import React, { Component } from 'react';
import { Field, withFormik } from 'formik';
import { isEqual } from 'lodash';
import Button from '@material-ui/core/Button';

import './EditorForm.css';
import { Input } from '@material-ui/core';

const formikEnhancer = withFormik({
    mapPropsToValues: props => ({ top: props.top, end: props.end }),
    mapValuesToPayload: x => x,
    handleSubmit: (payload, bag) => {
        setTimeout(function () {
            // alert(JSON.stringify(payload, null, 2));
            bag.setSubmitting(false);
            if (payload.values) delete payload['values'];
            bag.props.updateStep(payload);
        }, 1000);
    },
    displayName: 'MyForm',
});

class MyForm extends Component {
    componentWillUpdate(nextProps) {
        if (!isEqual(nextProps.top, this.props.top)) {
            this.props.resetForm(nextProps);
        }
    }

    render() {
        return (
            <form onSubmit={this.props.handleSubmit}>
                <div className="coordinatesBundle">
                    <label>Top</label>

                    <Field
                        render={() => (
                            <Input type="number"
                                name="top.x"
                                placeholder="x1"
                                maxLength="9"
                                value={this.props.values.top.x}
                                onChange={this.props.handleChange}></Input>
                        )}
                    />
                    <Field
                        render={() => (
                            <Input type="number"
                                name="top.y"
                                placeholder="y1"
                                maxLength="9"
                                value={this.props.values.top.y}
                                onChange={this.props.handleChange}></Input>
                        )}
                    />
                </div>
                <div className="coordinatesBundle">
                    <label>End</label>

                    <Field
                        render={() => (
                            <Input type="number"
                                name="end.x"
                                placeholder="x2"
                                value={this.props.values.end.x}
                                onChange={this.props.handleChange}></Input>
                        )}
                    />
                    <Field
                        render={() => (
                            <Input type="number"
                                name="end.y"
                                placeholder="y1"
                                value={this.props.values.end.y}
                                onChange={this.props.handleChange}></Input>
                        )}
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
                                variant="contained">Reset</Button>
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
