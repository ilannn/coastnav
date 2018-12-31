import React, { Component } from 'react';
import MyEnhancedForm from './editorForm/EditorForm';

import './Editor.css';
import { Card } from '@material-ui/core';

class Editor extends Component {

    render() {
        let editorContent;
        if (this.props.step) {
            editorContent = (
                <Card className="EditorCard">
                    <MyEnhancedForm 
                        {...this.props.step} 
                        updateStep={this.onSave.bind(this)}
                        onDelete={this.onDelete.bind(this)}
                    >
                    </MyEnhancedForm>
                </Card>
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