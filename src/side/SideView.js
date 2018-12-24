import React, { Component } from 'react';
import Nav from './nav/Nav';
import Editor from './editor/Editor';
import Scenario from './scenario/Scenario';

import './SideView.css';

class SideView extends Component {

    render() {
        return <section className="SideViewContainer">
            <Nav isEdit={!!this.props.selectedStep}
                tabs={[
                    {
                        label: "Editor",
                        onClick: this.props.onSelectStep,
                        content: (<Editor step={this.props.selectedStep}
                            onSave={this.props.editorOnSave}></Editor>)
                    },
                    {
                        label: "Scenario",
                        onClick: this.props.onUnselectStep,
                        content: (<Scenario
                            steps={this.props.steps}
                            onStepClick={this.props.onSelectStep}
                            onNewStep={this.props.onNewStep}
                            onRemoveStep={this.props.onRemoveStep}></Scenario>)
                    }
                ]}>
            </Nav>
        </section>
    }
}

export default SideView;