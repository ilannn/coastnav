import React, { Component } from 'react';
import './MapView.css';
import _ from 'lodash';
import { Map, TileLayer } from 'react-leaflet';
import Control from 'react-leaflet-control';
import L from 'leaflet';
import 'leaflet-mouse-position';
import 'leaflet-rotatedmarker';

import GeoService from '../services/GeoService';
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
import FixExtra from './steps/extras/FixExtra';
import RadiusExtra from './steps/extras/RadiusExtra';


const geoService = new GeoService();
const COOREDINATES_DEPTH = 15;
const initialCenter = [32.8201719, 34.6261597];
const initialZoom = 11;

class MapView extends Component {

    leafletMap = null;
    leafletSteps = {};
    leafletExtras = {};

    state = {
        steps: geoService.getSteps(),
        extras: [],
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
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", this.escFunction, false);
    }
    componentDidUpdate(prevProps, prevState) {
        //this.leafletMap.invalidateSize();
        this.drawStateSteps();
        this.drawStateExtras();
    }

    render() {
        return (<section className="MapViewContainer">
            <Map id="map" key="mymap"
                ref={this.setLeafletMapRef}
                center={initialCenter} zoom={initialZoom}
                zoomControl={false}
                maxZoom={15}
                minZoom={9}
                animate={true}
                onMouseMove={this.onDrawingMove.bind(this)}>

                {/* World */}
                {/* <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    opacity={0.5}
                    minZoom={12}
                /> */}

                {/* Full */}
                <TileLayer
                    url="full/{z}/{x}/{y}.png"
                />


                {/* Haifa */}
                <TileLayer
                    url="haifa/{z}/{x}/{y}.png"
                    minZoom={12}
                />

                {/* Kishon */}
                <TileLayer
                    url="kishon/{z}/{x}/{y}.png"
                    minZoom={15}
                />

                {/* Hadera */}
                <TileLayer
                    url="hadera/{z}/{x}/{y}.png"
                    minZoom={12}
                />

                {/* Hetzelia */}
                <TileLayer
                    url="hetzelia/{z}/{x}/{y}.png"
                    minZoom={12}
                />

                <Control position="topright">
                    <img src={'/icon.png'} alt={''} width="100px"/>
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
                lngFormatter: GeoService.formatCoordinate,
                latFormatter: GeoService.formatCoordinate,
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
        this.eraseExtras();
        extras.forEach(navExtra => {
            // Create new instance
            this.leafletExtras[navExtra.id] = this._createNewExtra(navExtra);
            // Register event listeners
            _.each(this.leafletExtras[navExtra.id],
                this.extraOnClickListener.bind(this)
            );
        });
    }

    _createNewExtra(navExtra) {
        switch (navExtra.type) {
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
        this.eraseItems(this.leafletExtras);
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
        this.eraseSteps();
        steps.forEach(navStep => {
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
        this.eraseItems(this.leafletSteps);
    }

    /* General Item */
    itemOnClick(event, collection, references) {
        // Isolate click
        event.originalEvent.view.L.DomEvent.stopPropagation(event);
        if (this.state.draw.isDrawing
            || (!this.state.draw.isDrawing && this.state.selectedTool)) {
            this.onMapClick(event);
            return;
        }

        // Find selected item
        const clickedItemId = +_.findKey(references, (itemLayers) => {
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

    eraseItems(references) {
        if (!this.leafletMap) {
            console.error("Couldn't erase items from map. Missing map ref");
            return;
        }
        _.mapValues(references, navItem => {
            // Remove all items layers from map
            _.each(navItem, layer => this.leafletMap.removeLayer(layer))
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
        // Check with tool type is used (step or extras)
        if (this.state.selectedTool) {
            StepType[this.state.selectedTool.type.description]
                // Handle the esc press accordinglly
                ? this.handleStepEsc()
                : this.handleExtrasEsc();
        }

        this.setState({
            selectedItem: undefined,
            draw: {
                ...this.state.draw,
                isDrawing: false,
            },
        });
    }

    handleStepEsc() {
        let steps = [];
        if (this.state.draw.isDrawing) {
            const selectedItem = this.state.selectedItem;
            steps = [...this.state.steps];
            _.remove(steps, step => step.id === selectedItem.id);
        }
        else {
            steps = this.state.steps;
        }
        this.setState({ steps });
    }

    handleExtrasEsc() {
        let extras = [];
        if (this.state.draw.isDrawing) {
            const selectedItem = this.state.selectedItem;
            extras = [...this.state.extras];
            _.remove(extras, extra => extra.id === selectedItem.id);
        }
        else {
            extras = this.state.extras;
        }
        this.setState({ extras });
    }

    onDrawingMove(event) {
        event.originalEvent.preventDefault();
        event.originalEvent.stopPropagation();
        if (this.state.draw.isDrawing) {
            // Check with tool type is used (step or extras)
            StepType[this.state.selectedTool.type.description]
                // Handle the event accordinglly
                ? this.handleStepDrawing(event)
                : this.hendleExtrasDrawing(event);
        }
    }

    handleStepDrawing(event) {
        // Update current selected step
        let updatedSteps = this.state.steps;
        let updatedSelectedStep = updatedSteps.find(step => {
            return step.id === this.state.selectedItem.id;
        });
        updatedSelectedStep = Object.assign(updatedSelectedStep, {
            positions: [
                updatedSelectedStep.positions[0],
                {
                    lat: Number((event.latlng.lat).toFixed(COOREDINATES_DEPTH)),
                    lng: Number((event.latlng.lng).toFixed(COOREDINATES_DEPTH))
                }
            ]
        });

        this.setState({
            steps: updatedSteps,
            selectedItem: updatedSelectedStep,
        });
    }

    hendleExtrasDrawing(event) {
        // Update current selected step
        let updatedExtras = this.state.extras;
        let updatedSelectedItem = updatedExtras.find(item => {
            return item.id === this.state.selectedItem.id;
        });
        // If drawing radius -> update it's radius
        if (updatedSelectedItem.type === ExtraType.R) {
            const radius = event.latlng.distanceTo(updatedSelectedItem.position);
            const length = GeoService.calcDistance(
                updatedSelectedItem.position,
                event.latlng
            ).dist;
            updatedSelectedItem = Object.assign(updatedSelectedItem,
                {
                    radius, length,
                });
        }
        // Otherwise => update current position
        else {
            let position = {
                lat: Number((event.latlng.lat).toFixed(COOREDINATES_DEPTH)),
                lng: Number((event.latlng.lng).toFixed(COOREDINATES_DEPTH))
            };
            if (this.state.draw.snapping) {
                position = GeoService.getNearestPosition(
                    position, this.state.steps,
                );
            }
            updatedSelectedItem = Object.assign(updatedSelectedItem, {
                position,
            });
        }

        this.setState({
            extras: updatedExtras,
            selectedItem: updatedSelectedItem,
        });
    }

    onMapClick(event) {
        event.originalEvent.preventDefault();

        // If no tool selected - do nothing
        if (!this.state.selectedTool) {
            return;
        }
        if (!this.state.draw.isDrawing) {
            // Check with tool type is used (step or extras)
            StepType[this.state.selectedTool.type.description]
                // Handle the event accordinglly
                ? this.handleStepStartDraw(event)
                : this.handleExtrasDraw(event);
        }
        else {
            // Check with tool type is used (step or extras)
            StepType[this.state.selectedTool.type.description]
                // Handle the event accordinglly
                ? this.handleStepStopDraw(event)
                : this.handleExtrasStopDraw(event);

            this.setState({
                draw: {
                    ...this.state.draw,
                    isDrawing: false,
                },
            });
        }
    }

    handleStepStartDraw(event) {
        // Create a new step, stating at click position
        let newStep;
        if (this.state.draw.snapping) {
            newStep = geoService.createNewSnappedItem(
                Number((event.latlng.lat).toFixed(COOREDINATES_DEPTH)),
                Number((event.latlng.lng).toFixed(COOREDINATES_DEPTH)),
                this.state.selectedTool.type,
                this.leafletMap.getZoom(),
                this.state.steps
            );
        }
        else {
            newStep = geoService.createNewStep(
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

    handleExtrasDraw(event) {
        // Create a new extra instance, stating at click position
        let newExtra;
        if (this.state.draw.snapping) {
            newExtra = geoService.createNewSnappedItem(
                Number((event.latlng.lat).toFixed(COOREDINATES_DEPTH)),
                Number((event.latlng.lng).toFixed(COOREDINATES_DEPTH)),
                this.state.selectedTool.type,
                this.leafletMap.getZoom(),
                this.state.steps
            );
        }
        else {
            newExtra = geoService.createNewExtra(
                Number((event.latlng.lat).toFixed(COOREDINATES_DEPTH)),
                Number((event.latlng.lng).toFixed(COOREDINATES_DEPTH)),
                this.state.selectedTool.type,
            );
        }
        
        // assing the new line the current tool's options
        Object.assign(newExtra, this.state.selectedTool.options);

        let updatedExtras = [...this.state.extras, newExtra];

        // Mark the new step as the selected step      
        this.setState({
            draw: {
                ...this.state.draw,
                isDrawing: true,
            },
            extras: updatedExtras,
            selectedItem: newExtra,
        });
    }

    handleStepStopDraw(event) {
        if (this.state.draw.snapping) {
            // When finished drawing - try finding a near point for ending
            const currentPositions = this.state.selectedItem.positions;
            const updatedStepEnding = GeoService.getNearestPosition(
                currentPositions[1],
                this.state.steps.slice(0, this.state.steps.length - 1),
                [currentPositions[0]] // blacklist snapping to starting point
            );
            this.handleSelectedItemChanges({
                positions: [currentPositions[0], updatedStepEnding]
            });
        }
    }

    handleExtrasStopDraw(event) {
    }

    handleRemoveStep(itemId) {
        let updatedItem = this.state.selectedItem;
        let collectionType = StepType[updatedItem.type.description]
            ? "steps" : "extras";
        let collection = this.state[collectionType];
        // remove deleted item from collection
        let updatedCollection = _.filter(collection, (item) => {
            return item.id !== itemId;
        });
        // unselect deleted item
        let selectedItem = this.state.selectedItem.id !== itemId
            ? this.state.selectedItem : null;

        let updatedState = {
            selectedItem: selectedItem,
        };
        updatedState[collectionType] = updatedCollection;
        this.setState(updatedState);
    }

    /* Editor */

    /**
     * Update the given step with given changes, taking
     * into consideration changes that effect other props.
     * Exp: angle -> end-position.
     * @param {number} updatedStepId 
     * @param {NavStepProps} changes 
     */
    handleSelectedItemChanges(changes) {
        const updatedItem = this.state.selectedItem;
        const collectionType = StepType[updatedItem.type.description]
            ? "steps" : "extras";
        let collection = this.state[collectionType];
        let changedItem = _.find(collection, { id: updatedItem.id });
        if (changedItem) {
            // Update item in collection
            Object.assign(changedItem, changes);
        }

        let updatedState = {
            selectedItem: changedItem,
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