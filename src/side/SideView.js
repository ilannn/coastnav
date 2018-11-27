import React, { Component } from 'react';
import './SideView.css';
import Nav from './nav/Nav';

import Editor from './editor/Editor';

class SideView extends Component {

    render() {
        return <section className="SideViewContainer">
            <Nav isEdit={!!this.props.selectedStep}
                tabs={[
                    {
                        label: "Editor",
                        onClick: this.props.onSelectStep,
                        content: (<Editor step={this.props.selectedStep}
                            onStepChange={this.props.editorOnChange}
                            onSave={this.props.editorOnSave}></Editor>)
                    },
                    {
                        label: "Scenario",
                        onClick: this.props.onUnselectStep,
                        content: (<h2>Hi</h2>)
                    }
                ]}>
            </Nav>
        </section>
    }
}

export default SideView;