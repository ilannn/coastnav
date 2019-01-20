import React, { Component } from 'react';
import './MapView.css';
import _ from 'lodash';
import { Map, TileLayer } from 'react-leaflet';
import Control from 'react-leaflet-control';
import L from 'leaflet';
import 'leaflet-mouse-position';
import 'leaflet-rotatedmarker';

import StepService from '../services/StepService';
import Editor from '../side/editor/Editor';
import Drawkit from './drawkit/Drawkit';
import GuidelineStep from './steps/navStep/GuidelineStep';
import TBStep from './steps/navStep/TBStep';
import CogStep from './steps/navStep/CogStep';
import { StepType } from '../models/steps';
import CrntStep from './steps/navStep/CrntStep';
import TCStep from './steps/navStep/TCStep';
import { Card, Switch } from '@material-ui/core';
import { ExtraType } from '../models/extras';
import RangeExtra from './steps/extras/RangeExtra';
import DRExtra from './steps/extras/DRExtra';
import FixExtra from './steps/extras/FixExtra';
import RadiusExtra from './steps/extras/RadiusExtra';


const stepService = new StepService();
const COOREDINATES_DEPTH = 7;
const center = [32.52018, 34.66461];

class MapView extends Component {

    leafletMap = null;
    leafletSteps = {};
    leafletExtras = {};

    state = {
        steps: stepService.getSteps(),
        extras: [{
            id: 1,
            time: new Date(),
            position: { lat: 32.43, lng: 34.43 },
            angle: 30,
            type: ExtraType.DR,
        }],
        selectedItem: undefined,
        selectedTool: null,
        draw: {
            isDrawing: false,
            snapping: true,
        },
    }

    constructor(props) {
        super(props);
        this.escFunction = this.escFunction.bind(this);
    }

    componentDidMount() {
        document.addEventListener("keydown", this.escFunction, false);
        this.leafletMap.on('click', this.onMapClick.bind(this));
        this.setMousePosition();
        this.drawStateSteps();
        this.setState({});
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", this.escFunction, false);
    }
    componentDidUpdate(prevProps, prevState) {
        //this.leafletMap.invalidateSize();
        this.eraseExtras(prevState.steps);
        this.drawStateSteps();
        this.drawStateExtras();
    }

    render() {
        return (<section className="MapViewContainer">
            <Map id="map" key="mymap"
                ref={this.setLeafletMapRef}
                center={center} zoom={10}
                zoomControl={false}
                maxZoom={15}
                minZoom={9}
                animate={true}
                onMouseMove={this.onDrawingMove.bind(this)}>

                {/* World */}
                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    opacity={0.5}
                    minZoom={12}
                />

                {/* Kishon */}
                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="hadera/{z}/{x}/{y}.png"
                />

                {/* Hadera */}
                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="kishon/{z}/{x}/{y}.png"
                />

                {/* Haifa */}
                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="haifa/{z}/{x}/{y}.png"
                />

                {/* Israel */}
                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="israel/{z}/{x}/{y}.png"
                />

                <Control position="topright">
                    <Drawkit
                        selectedTool={this.state.selectedTool}
                        onSelectTool={this.onSelectTool}
                        onClearAll={this.onClearAll}>

                        <Card>
                            {this.state.draw.snapping
                                ? <i className="material-icons">lock</i>
                                : <i className="material-icons">lock_open</i>}
                            <Switch
                                title={this.state.draw.snapping ? "Snapping On" : "Snapping Off"}
                                checked={this.state.draw.snapping}
                                onChange={this.onSnappingSwitch}>
                            </Switch>
                        </Card>
                    </Drawkit>
                </Control>

                <Control position="topleft">
                    <Editor
                        item={this.state.selectedItem}
                        onStepChange={this.state.editorOnChange}
                        onSave={this.handleSelectedItemChanges.bind(this)}
                        onDelete={this.handleEditorDelete.bind(this)}
                    >
                    </Editor>
                </Control>

            </Map>
        </section>)
    }

    setLeafletMapRef = map => (this.leafletMap = map && map.leafletElement);

    /* Snapping */
    onSnappingSwitch = (e) => {
        this.setState({
            draw: {
                ...this.state.draw,
                snapping: !this.state.draw.snapping
            },
        });
    }

    /* Drawkit */
    onSelectTool = (tool) => {
        if (!this.state.selectedTool || this.state.selectedTool.type !== tool.type) {
            this.setState({ selectedTool: tool });
        }
        else {
            this.setState({ selectedTool: null });
        }
    }

    /**
     * Erase all items from map, unselect selected step & empty item lists.
     */
    onClearAll = () => {
        this.eraseExtras();
        this.eraseSteps();
        this.unSelectItem();
        this.setState({
            steps: [],
            extras: [],
        });
    }

    /* Mouse */
    setMousePosition() {
        if (!this.leafletMap) {
            console.error("Couldn't add lines to map. Missing map ref");
        }
        else {
            L.control.mousePosition({
                position: 'bottomright',
                lngFormatter: StepService.formatCoordinate,
                latFormatter: StepService.formatCoordinate,
            }).addTo(this.leafletMap);
        }
    }

    /* Extras */
    drawStateExtras() {
        if (!this.state.extras) return;
        if (!this.leafletMap) {
            console.error("Couldn't draw extras on map. Missing map ref");
            return;
        }
        this.drawExtras(this.state.extras);
    }

    /**
     * Draw each nav extra in given list.
     * If already exists, remove it, create a new one, and add it.
     */
    drawExtras(extras) {
        extras.forEach(navExtra => {
            // Remove existing step's layers
            if (this.leafletExtras[navExtra.id]) {
                this.leafletExtras[navExtra.id].forEach(layer => {
                    this.leafletMap.removeLayer(layer);
                });
            }
            // Create new instance
            this.leafletExtras[navExtra.id] = this._createNewExtra(navExtra);
            // Register event listeners
            this.leafletExtras[navExtra.id].map(
                this.extraOnClickListener.bind(this)
            );
        });
    }

    _createNewExtra(navExtra) {
        switch (navExtra.type) {
            case ExtraType.RNG:
                return RangeExtra.addTo(this.leafletMap, navExtra);
            case ExtraType.DR:
                return DRExtra.addTo(this.leafletMap, navExtra);
            case ExtraType.FIX:
                return FixExtra.addTo(this.leafletMap, navExtra);
            case ExtraType.R:
            default:
                return RadiusExtra.addTo(this.leafletMap, navExtra);
        }
    }

    extraOnClickListener(extraLayer) {
        extraLayer.on('click', this.extraOnClick.bind(this));
    }

    extraOnClick(event) {
        this.itemOnClick(event, this.state.extras, this.leafletExtras);
    }

    eraseExtras = () => {
        this.eraseItems(this.state.extras, this.leafletExtras);
    }

    /* Steps */
    drawStateSteps() {
        if (!this.state.steps) return;
        if (!this.leafletMap) {
            console.error("Couldn't add lines to map. Missing map ref");
            return;
        }
        this.drawSteps(this.state.steps);
    }

    /**
     * Draw each nav step in state's steps list.
     * If step already exists, remove it, create a new one, and add it.
     */
    drawSteps(steps) {
        steps.forEach(navStep => {
            // Remove existing step's layers
            if (this.leafletSteps[navStep.id]) {
                this.leafletSteps[navStep.id].forEach(layer => {
                    this.leafletMap.removeLayer(layer);
                });
            }
            // Create new steps
            this.leafletSteps[navStep.id] = this._createNewStep(navStep);
            // Register event listeners
            this.leafletSteps[navStep.id].map(
                this.stepOnClickListener.bind(this)
            );
        });
    }

    _createNewStep(navStep) {
        switch (navStep.type) {
            case StepType.TB:
                return TBStep.addTo(this.leafletMap, navStep);
            case StepType.COG:
                return CogStep.addTo(this.leafletMap, navStep);
            case StepType.CRNT:
                return CrntStep.addTo(this.leafletMap, navStep);
            case StepType.TC:
                return TCStep.addTo(this.leafletMap, navStep);
            case StepType.GUIDELINE:
            default:
                return GuidelineStep.addTo(this.leafletMap, navStep);
        }
    }

    stepOnClickListener(stepLayer) {
        stepLayer.on('click', this.stepOnClick.bind(this));
    }

    stepOnClick(event) {
        this.itemOnClick(event, this.state.steps, this.leafletSteps);
    }

    eraseSteps = () => {
        this.eraseItems(this.state.steps, this.leafletSteps);
    }

    /* General Item */
    itemOnClick(event, collection, references) {
        if (this.state.draw.isDrawing) {
            return;
        }
        // Isolate click
        event.originalEvent.view.L.DomEvent.stopPropagation(event);

        // Find selected item
        let clickedItemId = +_.findKey(references, (itemLayers) => {
            return itemLayers.indexOf(event.target) >= 0;
        });
        if (!clickedItemId) return;
        // Select / Unselect
        if (!this.state.selectedItem || clickedItemId !== this.state.selectedItem.id) {
            this.selectItem(_.find(collection, {
                id: clickedItemId
            }));
        }
        else {
            this.unSelectItem();
        }
    }

    selectItem(item) {
        this.setState({
            selectedItem: item,
        });
    }

    unSelectItem() {
        this.setState({
            selectedItem: undefined,
        });
    }

    eraseItems(collection, references) {
        if (!collection) return;
        if (!this.leafletMap) {
            console.error("Couldn't erase items from map. Missing map ref");
            return;
        }
        collection.forEach(navItem => {
            // Remove all steps layers from map
            if (references[navItem.id]) {
                references[navItem.id].forEach(layer => {
                    this.leafletMap.removeLayer(layer);
                });
            }
        });
    }

    /* User Interaction */
    escFunction(event) {
        if (event.keyCode === 27) {
            this.handleEscPress();
        }
    }

    /**
     * Cancel drawing & unselect step when ESC pressed.
     */
    handleEscPress() {
        let steps;
        if (this.state.draw.isDrawing) {
            let selectedItem = this.state.selectedItem;
            steps = [...this.state.steps];
            _.remove(steps, step => step.id === selectedItem.id);
        }
        else {
            steps = this.state.steps;
        }
        this.setState({
            selectedItem: undefined,
            steps: steps,
            draw: {
                ...this.state.draw,
                isDrawing: false,
            },
        });
    }

    onDrawingMove(event) {
        event.originalEvent.preventDefault();
        event.originalEvent.stopPropagation();
        if (this.state.draw.isDrawing) {
            // Update current selected step
            let updatedSteps = this.state.steps;
            let updatedselectedItem = updatedSteps.find(step => {
                return step.id === this.state.selectedItem.id;
            });
            updatedselectedItem = Object.assign(updatedselectedItem, {
                positions: [
                    updatedselectedItem.positions[0],
                    {
                        lat: Number((event.latlng.lat).toFixed(COOREDINATES_DEPTH)),
                        lng: Number((event.latlng.lng).toFixed(COOREDINATES_DEPTH))
                    }
                ]
            });

            this.setState({
                steps: updatedSteps,
                selectedItem: updatedselectedItem,
            });
        }
    }

    onMapClick(event) {
        event.originalEvent.preventDefault();

        // If no tool selected - do nothing
        if (!this.state.selectedTool) {
            return;
        }
        if (!this.state.draw.isDrawing) {
            // Create a new step, stating at click position
            let newStep;
            if (this.state.draw.snapping) {
                newStep = stepService.createNewSnappedStep(
                    Number((event.latlng.lat).toFixed(COOREDINATES_DEPTH)),
                    Number((event.latlng.lng).toFixed(COOREDINATES_DEPTH)),
                    this.state.selectedTool.type,
                    this.state.steps
                );
            }
            else {
                newStep = stepService.createNewStep(
                    Number((event.latlng.lat).toFixed(COOREDINATES_DEPTH)),
                    Number((event.latlng.lng).toFixed(COOREDINATES_DEPTH)),
                    this.state.selectedTool.type,
                );
            }

            // assing the new line the current tool's options
            Object.assign(newStep, this.state.selectedTool.options);

            let updatedSteps = [...this.state.steps, newStep];

            // Mark the new step as the selected step      
            this.setState({
                draw: {
                    ...this.state.draw,
                    isDrawing: true,
                },
                steps: updatedSteps,
                selectedItem: newStep,
            });
        }
        else {
            if (this.state.draw.snapping) {
                // When finished drawing - try finding a near point for ending
                let currentPositions = this.state.selectedItem.positions;
                let updatedStepEnding = StepService.getNearestPosition(
                    currentPositions[1],
                    this.state.steps.slice(0, this.state.steps.length - 1),
                    [currentPositions[0]]
                );
                this.handleSelectedItemChanges(this.state.selectedItem.id, {
                    positions: [currentPositions[0], updatedStepEnding]
                });
            }
            this.setState({
                draw: {
                    ...this.state.draw,
                    isDrawing: false,
                },
            });
        }
    }

    handleRemoveStep(stepId) {
        // remove deleted step from steps list
        let updatedSteps = _.filter(this.state.steps, (step) => {
            return step.id !== stepId;
        });
        // unselect deleted step
        let selectedItem = this.state.selectedItem.id !== stepId
            ? this.state.selectedItem : null;

        this.setState({
            /* Update selected view */
            steps: updatedSteps,
            selectedItem: selectedItem,
        });
    }

    /* Editor */

    /**
     * Update the given step with given changes, taking
     * into consideration changes that effect other props.
     * Exp: angle -> end-position.
     * @param {number} updatedStepId 
     * @param {NavStepProps} changes 
     */
    handleSelectedItemChanges(updatedStepId, changes) {
        debugger;
        let updatedItem = this.state.selectedItem;
        let collectionType = StepType[updatedItem.type.description] 
            ? "steps" : "extras";
        let collection = this.state[collectionType];
        let oldItem = collection.find((item) => {
            return item.id === updatedItem.id;
        });
        if (oldItem) {
            Object.assign(oldItem, changes);
        }

        /* Update selected item & global item list */
        let updatedState = {
            selectedItem: this.state[collectionType].find((item) => {
                return item.id === updatedItem.id;
            }),
        };
        updatedState[collectionType] = collection;
        this.setState(updatedState);
    }

    handleEditorDelete(deletedStepId) {
        // Insert pop up alert here..
        this.handleRemoveStep(deletedStepId);
    }
}

export default MapView;