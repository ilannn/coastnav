import React, { Component } from 'react';
import { withFormik } from 'formik';
import { isEqual } from 'lodash';

const formikEnhancer = withFormik({
    mapPropsToValues: props => ({ top: props.top, end: props.end }),
    mapValuesToPayload: x => x,
    handleSubmit: (payload, bag) => {
        setTimeout(function () {
            // alert(JSON.stringify(payload, null, 2));
            bag.setSubmitting(false);
            delete payload['values'];
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
                <label htmlFor="top">Top</label>
                <input
                    id="top.x"
                    value={this.props.values.top.x}
                    onChange={this.props.handleChange}
                    onBlur={this.props.handleBlur}
                    placeholder="x1"
                />
                <input
                    id="top.y"
                    value={this.props.values.top.y}
                    onChange={this.props.handleChange}
                    onBlur={this.props.handleBlur}
                    placeholder="y1"
                />
                <br />
                <label htmlFor="end">End</label>
                <input
                    id="end.x"
                    value={this.props.values.end.y}
                    onChange={this.props.handleChange}
                    onBlur={this.props.handleBlur}
                    placeholder="x2"
                />
                <input
                    id="end.y"
                    value={this.props.values.end.y}
                    onChange={this.props.handleChange}
                    onBlur={this.props.handleBlur}
                    placeholder="y2"
                />

                <button
                    type="button"
                    className="outline"
                    onClick={this.props.handleReset}
                    disabled={
                        !this.props.dirty || this.props.isSubmitting
                    }
                >
                    Reset
          </button>
                <button
                    type="submit"
                    disabled={this.props.isSubmitting}
                >
                    Submit
          </button>
            </form>
        );
    }
}

const MyEnhancedForm = formikEnhancer(MyForm);

export default MyEnhancedForm;
