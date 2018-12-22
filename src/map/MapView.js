import React, { Component } from 'react';
import './MapView.css';
import _ from 'lodash';
import { Map, TileLayer } from 'react-leaflet';
import { Sidebar, Tab } from 'react-leaflet-sidebarv2';
import Control from 'react-leaflet-control';
import L from 'leaflet';

import StepService from '../services/StepService';
import Editor from '../side/editor/Editor';
import Drawkit from './drawkit/Drawkit';
import NavStep from './steps/navStep/NavStep';
import GuidelineStep from './steps/navStep/GuidelineStep';
import TBStep from './steps/navStep/TBStep';

const stepService = new StepService();
const COOREDINATES_DEPTH = 7;
const center = [32.374, 35.116]

class MapView extends Component {

    leafletMap = null;

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
    }

    componentDidMount() {
        document.addEventListener("keydown", this.escFunction, false);
        this.setNavSteps();
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", this.escFunction, false);
    }
    componentDidUpdate(prevProps, prevState) {
        this.leafletMap.invalidateSize();
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
                    <Drawkit onSelectTool={this.onSelectTool.bind(this)}>
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
                            onSave={this.state.editorOnSave}></Editor>
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
        this.setState({
            selectedTool: tool,
        })
    }

    /* Steps */
    setNavSteps() {
        if (!this.leafletMap) {
            console.error("Couldn't add lines to map.");
        }
        else {
            if (this.state.steps) {
                this.state.steps.forEach(navStep => {
                    TBStep.addTo(this.leafletMap, navStep);
                    // this.leafletMap.add.push(<TBStep {...navStep} key={navStep.id}
                    //     handleClick={this.handleStepClick.bind(this)}></TBStep>);
                });
            }
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
        event.originalEvent.preventDefault();
        event.originalEvent.view.L.DomEvent.stopPropagation(event);
        if (!this.state.selectedTool) {
            return;
        }
        if (!this.state.draw.isDrawing) {
            // Create a new step, stating at click position
            let newStep = stepService.getNewStep(
                Number((event.latlng.lat).toFixed(COOREDINATES_DEPTH)),
                Number((event.latlng.lng).toFixed(COOREDINATES_DEPTH))
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
            updatedSelectedStep.type = 1;

            this.setState({
                draw: { isDrawing: false },
                steps: updatedSteps,
                selectedStep: updatedSelectedStep,
            });
        }
    }

    handleNewStep() {
        let newStep = stepService.getNewStep();
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