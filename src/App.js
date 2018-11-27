import React, { Component } from 'react';
import './App.css';
import MapView from './map/MapView';
import SideView from './side/SideView';
import StepService from './services/StepService';

const stepService = new StepService();

class App extends Component {
  state = {
    steps: stepService.getSteps(),
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
          onUnselectStep={this.unSelectStep.bind(this)}
          onNewStep={this.handleNewStep.bind(this)}></SideView>
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

  handleNewStep() {
    let newStep = stepService.getNewStep();
    this.setState({
      steps: [...this.state.steps, newStep],
      selectedStep: newStep
    })
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
