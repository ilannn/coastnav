import React, { Component } from 'react';
import './Editor.css';
import MyEnhancedForm from './editorForm/EditorForm';

class Editor extends Component {

    render() {
        let editorContent;
        if (this.props.step) {
            editorContent = (
                <MyEnhancedForm {...this.props.step} updateStep={this.onSave}></MyEnhancedForm>
            );
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