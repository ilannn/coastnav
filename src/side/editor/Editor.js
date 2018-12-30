import React, { Component } from 'react';
import MyEnhancedForm from './editorForm/EditorForm';

import './Editor.css';

class Editor extends Component {

    render() {
        let editorContent;
        if (this.props.step) {
            editorContent = (
                <MyEnhancedForm 
                    {...this.props.step} 
                    updateStep={this.onSave.bind(this)}
                    onDelete={this.onDelete.bind(this)}
                >
                </MyEnhancedForm>
            );
        }
        return (
            <section className="EditorContainer">
                {editorContent}
            </section>
        )
    }
    
    onSave(changes) {
        this.props.onSave(this.props.step.id, changes);
    }

    onDelete() {
        this.props.onDelete(this.props.step.id);
    }
}

export default Editor;