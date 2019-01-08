import React, { Component } from 'react';
import './Editor.css';
import { Card } from '@material-ui/core';
import EditorFormContainer from './EditorFormContainer';

class Editor extends Component {

    state = {
        values: {}
    }

    render() {
        let editorContent;
        if (this.props.step) {
            editorContent = (
                <Card className="EditorCard">
                    <EditorFormContainer
                        key={this.props.id}
                        onSave={this.onSave}
                        onDelete={this.onDelete}
                        {...this.props.step}>
                    </EditorFormContainer>
                </Card>
            );
        }
        return (
            <section className="EditorContainer">
                {editorContent}
            </section>
        )
    }

    onSave = (changes) => {
        this.props.onSave(this.props.step.id, changes);
    }

    onDelete = () => {
        this.props.onDelete(this.props.step.id);
    }
}

export default Editor;