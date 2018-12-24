import React, { Component } from 'react';
import './MapView.css';
import _ from 'lodash';
import { Map, TileLayer } from 'react-leaflet';
import { Sidebar, Tab } from 'react-leaflet-sidebarv2';
import Control from 'react-leaflet-control';
import L from 'leaflet';
import 'leaflet-mouse-position';

import StepService from '../services/StepService';
import Editor from '../side/editor/Editor';
import Drawkit from './drawkit/Drawkit';
import GuidelineStep from './steps/navStep/GuidelineStep';
import TBStep from './steps/navStep/TBStep';
import CogStep from './steps/navStep/CogStep';
import { StepType } from '../models/steps';

const stepService = new StepService();
const COOREDINATES_DEPTH = 7;
const center = [32.374, 35.116]

class MapView extends Component {

    leafletMap = null;
    leafletSteps = {};

    state = {
        steps: stepService.getSteps(),
        selectedStep: undefined,
        selectedTool: null,
        draw: {
            isDrawing: false,
        },
        mouseInfo: {
            lan: undefined,
            lat: undefined,
        },
        collapsed: true,
        selected: 'home',
    }

    constructor(props) {
        super(props);
        this.escFunction = this.escFunction.bind(this);
        this.setMousePosition = this.setMousePosition.bind(this);
    }

    componentDidMount() {
        document.addEventListener("keydown", this.escFunction, false);
        this.setMousePosition();
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", this.escFunction, false);
    }
    componentDidUpdate(prevProps, prevState) {
        
        this.leafletMap.invalidateSize();
        this.setNavSteps();
        
        // Update collapse flag if selected step changed
        if (this.state.selectedStep !== prevState.selectedStep) {
            this.setState({
                collapsed: !this.state.selectedStep,
            });
        }
    }

    render() {
        return (<section className="MapViewContainer">
            <Map id="map" key="mymap"
                ref={this.setLeafletMapRef}
                center={center} zoom={10}
                onClick={this.onMapClick.bind(this)}
                onMouseMove={this.onDrawingMove.bind(this)}>
                
                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Control position="topright">
                    <Drawkit 
                        selectedTool={this.state.selectedTool}
                        onSelectTool={this.onSelectTool.bind(this)}>
                    </Drawkit>
                </Control>

                <Sidebar id="sidebar"
                    collapsed={this.state.collapsed}
                    selected={this.state.selected}
                    onOpen={this.onSideBarOpen.bind(this)}
                    onClose={this.onSideBarClose.bind(this)}
                    onClick={this.onSideBarClick.bind(this)}>
                    <Tab id="home" header="Home" icon="fa fa-home">
                        <Editor step={this.state.selectedStep}
                            onStepChange={this.state.editorOnChange}
                            onSave={this.handleEditorSave}></Editor>
                    </Tab>
                    <Tab id="settings" header="Settings" icon="fa fa-cog" anchor="bottom">
                        <p>Settings dialogue.</p>
                    </Tab>
                </Sidebar>

            </Map>
        </section>)
    }

    setLeafletMapRef = map => (this.leafletMap = map && map.leafletElement);

    /* Sidebar */
    onSideBarClose() {
        this.setState({ collapsed: true });
    }

    onSideBarOpen(id) {
        this.setState({
            collapsed: false,
            selected: id,
        });
    }

    onSideBarClick(event) {
        event.originalEvent.preventDefault();
        event.originalEvent.view.L.DomEvent.stopPropagation(event);
    }

    /* Drawkit */
    onSelectTool(tool) {
        if (!this.state.selectedTool || this.state.selectedTool.type !== tool.type) {
            this.setState({ selectedTool: tool });
        }
        else {
            this.setState({ selectedTool: null });
        }
    }

    /* Mouse */
    setMousePosition() {
        if (!this.leafletMap) {
            console.error("Couldn't add lines to map. Missing map ref");
        }
        else {
            L.control.mousePosition({
                position: 'bottomright',
            }).addTo(this.leafletMap);
        }
    }

    /* Steps */
    setNavSteps() {
        if (!this.leafletMap) {
            console.error("Couldn't add lines to map. Missing map ref");
        }
        else {
            // TODO: Check the diff between state and saved steps.
            if (this.state.steps) {
                this.state.steps.forEach(navStep => {
                    // Remove existing steps
                    if (this.leafletSteps[navStep.id]) {
                        this.leafletSteps[navStep.id].map(layer => {
                            this.leafletMap.removeLayer(layer);
                        })
                    }
                    // Create new steps
                    this.leafletSteps[navStep.id] = this._getNewStep(navStep);
                });
            }
        }
    }

    _getNewStep(navStep) {
        switch(navStep.type) {
            case StepType.TB:
                return TBStep.addTo(this.leafletMap, navStep);
            case StepType.COG:
                return CogStep.addTo(this.leafletMap, navStep);
            case StepType.GUIDELINE: 
            default:
                return GuidelineStep.addTo(this.leafletMap, navStep);
        }
    }

    selectStep(step) {
        this.setState({
            selectedStep: step,
        });
    }

    unSelectStep() {
        this.setState({
            selectedStep: undefined,
        });
    }

    handleStepClick(stepId) {
        this.selectStep(this.state.steps.find(
            (step) => {
                return step.id === stepId;
            })
        );
    }

    escFunction(event) {
        if (event.keyCode === 27) {
            this.handleEscPress();
        }
    }

    /**
     * Cancel drawing & unselect step when ESC pressed.
     */
    handleEscPress() {
        if (this.state.draw.isDrawing) {
            let selectedStep = this.state.selectedStep;
            let steps = [...this.state.steps];
            _.remove(steps, step => step.id === selectedStep.id);

            this.setState({
                selectedStep: undefined,
                steps: steps,
                draw: {
                    isDrawing: false,
                },
            });
        }
    }

    onDrawingMove(event) {
        event.originalEvent.preventDefault();
        event.originalEvent.stopPropagation();
        if (this.state.draw.isDrawing) {
            // Update current selected step
            let updatedSteps = this.state.steps;
            let updatedSelectedStep = updatedSteps.find(step => {
                return step.id === this.state.selectedStep.id;
            });

            updatedSelectedStep = Object.assign(updatedSelectedStep, {
                positions: [
                    updatedSelectedStep.positions[0],
                    [
                        Number((event.latlng.lat).toFixed(COOREDINATES_DEPTH)),
                        Number((event.latlng.lng).toFixed(COOREDINATES_DEPTH))
                    ]
                ]
            });

            this.setState({
                steps: updatedSteps,
                selectedStep: updatedSelectedStep,
                mouseInfo: { ...event.latlng },
            });
        }
        else {
            this.setState({ mouseInfo: { ...event.latlng } });
        }
    }

    onMapClick(event) {
        // Isolate this event
        //event.originalEvent.preventDefault();
        //event.originalEvent.view.L.DomEvent.stopPropagation(event);
        if (!this.state.selectedTool) {
            return;
        }
        if (!this.state.draw.isDrawing) {
            // Create a new step, stating at click position
            let newStep = stepService.createNewStep(
                Number((event.latlng.lat).toFixed(COOREDINATES_DEPTH)),
                Number((event.latlng.lng).toFixed(COOREDINATES_DEPTH)),
                this.state.selectedTool.type
            );
            
            // assing the new line the current tool's options
            Object.assign(newStep, this.state.selectedTool.options);
            
            let updatedSteps = [...this.state.steps, newStep];

            // Mark the new step as the selected step      
            this.setState({
                draw: { isDrawing: true },
                steps: updatedSteps,
                selectedStep: newStep,
            });
        }
        else {
            // Finished drawing -> Update current selected step
            let updatedSteps = this.state.steps;
            let updatedSelectedStep = updatedSteps.find(step => {
                return this.state.selectedStep && step.id === this.state.selectedStep.id;
            });

            this.setState({
                draw: { isDrawing: false },
                steps: updatedSteps,
                selectedStep: updatedSelectedStep,
            });
        }
    }

    handleNewStep() {
        let newStep = stepService.createNewStep();
        this.setState({
            steps: [...this.state.steps, newStep],
            selectedStep: newStep,
        });
    }

    handleRemoveStep(stepId) {
        let updatedSteps = _.filter(this.state.steps, (step) => {
            return step.id !== stepId;
        });
        this.setState({
            /* Update selected view */
            steps: updatedSteps,
        });
    }

    handleEditorSave(updatedStepId, changes) {
        let steps = this.state.steps;
        let oldStep = steps.find((step) => {
            return step.id === updatedStepId;
        });
        if (oldStep) {
            Object.assign(oldStep, changes);
        }

        /* Update selected view & global steps list */
        this.setState({
            selectedStep: this.state.steps.find((step) => {
                return step.id === updatedStepId;
            }),
            steps: steps,
        });
    }
}

export default MapView;