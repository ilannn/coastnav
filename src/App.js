import React, { Component } from 'react';
import MapView from './map/MapView';
import SideView from './side/SideView';
import StepService from './services/StepService';
import _ from 'lodash';

import './App.css';

const stepService = new StepService();

class App extends Component {
  state = {
    steps: stepService.getSteps(),
    selectedStep: undefined,
    newStep: {
      isDrawing: false
    }
  }
  render() {
    return (
      <div className="App">
        <MapView
          steps={this.state.steps}
          handleStepClick={this.handleStepClick.bind(this)}
          newStep={this.state.newStep}
          onDrawingClick={this.onDrawingClick.bind(this)}
          onDrawingMove={this.onDrawingMove.bind(this)}></MapView>
        <SideView
          steps={this.state.steps}
          selectedStep={this.state.selectedStep}
          editorOnSave={this.handleEditorSave.bind(this)}
          onSelectStep={this.selectStep.bind(this)}
          onUnselectStep={this.unSelectStep.bind(this)}
          onNewStep={this.handleNewStep.bind(this)}
          onRemoveStep={this.handleRemoveStep.bind(this)}></SideView>
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

  onDrawingMove(event) {
    if (this.state.newStep.isDrawing) {
      // Update current selected step
      let updatedSteps = this.state.steps;
      let updatedSelectedStep = updatedSteps.find(step => {
        return step.id === this.state.selectedStep.id;
      });
      updatedSelectedStep.positions[1] = [event.latlng.lat, event.latlng.lng];

      this.setState({
        steps: updatedSteps,
        selectedStep: updatedSelectedStep
      });
    }
  }

  onDrawingClick(event) {
    if (!this.state.newStep.isDrawing) {
      // Create a new step, stating at page X & Y
      let newStep = stepService.getNewStep(event.latlng.lat, event.latlng.lng);
      let updatedSteps = [...this.state.steps, newStep];

      // Mark the new step as the selected step
      this.setState({
        newStep: { isDrawing: true },
        steps: updatedSteps,
        selectedStep: updatedSteps.find(step => {
          return step.id === newStep.id;
        }),
      });
    }
    else {
      // Update current selected step
      let updatedSteps = this.state.steps;
      let updatedSelectedStep = updatedSteps.find(step => {
        return step.id === this.state.selectedStep.id;
      });
      updatedSelectedStep.type = 1;

      this.setState({
        newStep: { isDrawing: false },
        steps: updatedSteps,
        selectedStep: updatedSelectedStep
      });
    }
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

  handleRemoveStep(stepId) {
    let updatedSteps = _.filter(this.state.steps, (step) => {
      return step.id !== stepId;
    });
    this.setState({
      /* Update selected view */
      steps: updatedSteps
    });
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
