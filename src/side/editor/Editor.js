import React, { Component } from 'react';
import './Editor.css';
import { Card } from '@material-ui/core';
import StepEditorFormContainer from './StepEditorFormContainer';
import ExtraEditorFormContainer from './ExtraEditorFormContainer';
import { StepType } from '../../models/steps';

class Editor extends Component {

    state = {
        values: {}
    }

    render() {
        let editorContent;
        if (this.props.item) {
            editorContent = (StepType[this.props.item.type.description])
                ? (
                    <Card className="EditorCard">
                        <StepEditorFormContainer
                            key={this.props.id}
                            onSave={this.onSave}
                            onDelete={this.onDelete}
                            {...this.props.item}>
                        </StepEditorFormContainer>
                    </Card>
                )
                : (
                    <Card className="EditorCard">
                        <ExtraEditorFormContainer
                            key={this.props.id}
                            onSave={this.onSave}
                            onDelete={this.onDelete}
                            {...this.props.item}>
                        </ExtraEditorFormContainer>
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
        this.props.onSave(this.props.item.id, changes);
    }

    onDelete = () => {
        this.props.onDelete(this.props.item.id);
    }
}

export default Editor;