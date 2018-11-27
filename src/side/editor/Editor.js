import React, { Component } from 'react';
import './Editor.css';
import { Form, Formik, Field, withFormik } from 'formik';
import MyEnhancedForm from './editorForm/EditorForm';

class Editor extends Component {

    render() {
        let editorContent;
        if (this.props.step) {
            /* editorContent = (
                <div className="EditorContent">
                    <Formik
                        initialValues={this.props.step}
                        validate={values => {
                            let errors = {};
                            if (values.top)
                                if (values.top && (isNaN(values.top.x) || isNaN(values.top.y))) {
                                    errors.top = "Top coordinates not a number";
                                }
                            if (values.end && (isNaN(values.end.x) || isNaN(values.end.y))) {
                                errors.end = "End coordinates not a number";
                            }
                        }}
                        onSubmit={(values, { setSubmitting }) => {
                            setTimeout(() => {
                                console.log(values);
                                this.onSave(values);
                                setSubmitting(false);
                            }, 400);
                        }}>
                        {({ isSubmitting }) => (
                            <Form>
                                <Field type="number" placeholder="x1" name="top.x"></Field>
                                <Field type="number" placeholder="y1" name="top.y"></Field>
                                <Field type="number" placeholder="x2" name="end.x"></Field>
                                <Field type="number" placeholder="y2" name="end.y"></Field>
                                <Field type="number" name="length"></Field>
                                <button type="submit" disabled={isSubmitting}>Save</button>
                            </Form>
                        )}
                    </Formik>
                </div>
            ); */
            editorContent = <MyEnhancedForm {...this.props.step} updateStep={this.onSave}></MyEnhancedForm>
            console.log(this.props.step);
        }
        return (
            <section className="EditorContainer">
                {editorContent}
            </section>
        )
    }
    onSave = (changes) => {
        console.log("OnSave Editor");
        this.props.onSave(this.props.step.id, changes);
    }
}

export default Editor;