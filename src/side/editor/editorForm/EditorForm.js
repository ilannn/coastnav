import React, { Component } from 'react';
import { Field, withFormik } from 'formik';
import { isEqual } from 'lodash';
import Button from '@material-ui/core/Button';

import './EditorForm.css';
import { Input } from '@material-ui/core';

const formikEnhancer = withFormik({
    mapPropsToValues: props => { 
        return { start: props.positions[0], end: props.positions[1] }
    },
    //mapValuesToPayload: x => x,
    handleSubmit: (payload, bag) => {
        setTimeout(function () {
            // alert(JSON.stringify(payload, null, 2));
            bag.setSubmitting(false);
            if (payload.values) delete payload['values'];
            console.log(payload, " was submitted");
            
            bag.props.updateStep({
                positions: [payload.start, payload.end]
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
        debugger;
        return (
            <form onSubmit={this.props.handleSubmit}>
                <div className="coordinatesBundle">
                    <label>From</label>

                    <Field
                        render={() => (
                            <Input type="number"
                                name="start[0]"
                                placeholder="Lat"
                                maxLength="9"
                                value={this.props.values.start[0]}
                                onChange={this.props.handleChange}></Input>
                        )}
                    />
                    <Field
                        render={() => (
                            <Input type="number"
                                name="start[1]"
                                placeholder="Lng"
                                maxLength="9"
                                value={this.props.values.start[1]}
                                onChange={this.props.handleChange}></Input>
                        )}
                    />
                </div>
                <div className="coordinatesBundle">
                    <label>To</label>

                    <Field
                        render={() => (
                            <Input type="number"
                                name="end[0]"
                                placeholder="Lat"
                                value={this.props.values.end[0]}
                                onChange={this.props.handleChange}></Input>
                        )}
                    />
                    <Field
                        render={() => (
                            <Input type="number"
                                name="end[1]"
                                placeholder="Lng"
                                value={this.props.values.end[1]}
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
