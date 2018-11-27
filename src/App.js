import React, { Component } from 'react';
import './App.css';
import MapView from './map/MapView';
import SideView from './side/SideView';

const getSteps = (limit) => {
  return [
    { id: 1, type: 1, top: { x: 0, y: 0 }, end: { x: 200, y: 200 }, length: 10 },
    { id: 2, type: 2, top: { x: 110, y: 100 }, end: { x: 200, y: 200 }, length: 10 }
  ]
}

class App extends Component {
  state = {
    steps: getSteps(),
    selectedStep: undefined
  }
  render() {
    return (
      <div className="App">
        <MapView
          steps={this.state.steps}
          handleStepClick={this.handleStepClick.bind(this)}></MapView>
        <SideView
          steps={this.state.steps}
          selectedStep={this.state.selectedStep}
          editorOnSave={this.handleEditorSave.bind(this)}
          onSelectStep={this.selectStep.bind(this)}
          onUnselectStep={this.unSelectStep.bind(this)}></SideView>
      </div>
    );
  }

  selectStep(step) {
    this.setState({
      selectedStep: step
    });
  }
  unSelectStep() {
    this.setState({
      selectedStep: undefined
    });
  }

  handleStepClick = (stepId) => {
    this.selectStep(this.state.steps.find(
      (step) => {
        return step.id === stepId;
      })
    );
  }

  handleEditorSave = (updatedStepId, changes) => {
    let steps = this.state.steps;
    let oldStep = steps.find((step) => {
      return step.id === updatedStepId;
    });
    if (oldStep) {
      Object.assign(oldStep, changes);
    }
    this.setState({
      /* Update selected view */
      selectedStep: this.state.steps.find((step) => {
        return step.id === updatedStepId;
      }),
      /* Update global steps list */
      steps: steps
    });
  }
}

export default App;
