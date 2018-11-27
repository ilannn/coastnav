import React, { Component } from 'react';
import './SideView.css';
import Nav from './nav/Nav';
import Editor from './editor/Editor';

class SideView extends Component {
    render() {
        return <section className="SideViewContainer">
            <Nav isEdit={!!this.props.selectedStep}></Nav>
            <Editor step={this.props.selectedStep} 
                    onStepChange={this.props.editorOnChange}
                    onSave={this.props.editorOnSave}></Editor>
        </section>
    }
}

export default SideView;