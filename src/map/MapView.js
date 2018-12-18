import React, { Component } from 'react';
/* import SimpleStep from './steps/simpleStep/SimpleStep';
import ReactCursorPosition from 'react-cursor-position'; */
import { Map, TileLayer } from 'react-leaflet';
import { Sidebar, Tab } from 'react-leaflet-sidebarv2';
import Editor from '../side/editor/Editor';
import NavStep from './steps/navStep/NavStep';
import MouseInfo from './mouse/MouseInfo';

import './MapView.css';

const center = [51.505, -0.09]

class MapView extends Component {

    leafletMap = null;

    state = {
        collapsed: !this.props.selectedStep,
        selected: 'home',
    };

    constructor(props) {
        super(props);
        this.escFunction = this.escFunction.bind(this);
    }

    setLeafletMapRef = map => (this.leafletMap = map && map.leafletElement);

    componentDidMount() {
        document.addEventListener("keydown", this.escFunction, false);
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", this.escFunction, false);
    }
    componentDidUpdate(prevProps) {
        this.leafletMap.invalidateSize();
        if (this.props.selectedStep !== prevProps.selectedStep) {
            this.setState({
                collapsed: !this.props.selectedStep 
            });
        }
    }

    render() {
        return (<section className="MapViewContainer">
            <Sidebar id="sidebar"
                collapsed={this.state.collapsed} selected={this.state.selected}
                onOpen={this.onOpen.bind(this)} onClose={this.onClose.bind(this)}>
                <Tab id="home" header="Home" icon="fa fa-home">
                    <Editor step={this.props.selectedStep}
                        onStepChange={this.props.editorOnChange}
                        onSave={this.props.editorOnSave}></Editor>
                </Tab>
                <Tab id="settings" header="Settings" icon="fa fa-cog" anchor="bottom">
                    <p>Settings dialogue.</p>
                </Tab>
            </Sidebar>
            <Map id="map" key="mymap"
                ref={this.setLeafletMapRef}
                center={center} zoom={13}
                onClick={this.onDrawingClick.bind(this)}
                onMouseMove={this.onDrawingMove.bind(this)}>

                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {this.getNavSteps()}
            </Map>
            {/* <MouseInfo {...this.props.mouseInfo}></MouseInfo> */}
        </section>)
    }


    onClose() {
        this.setState({ collapsed: true });
    }
    onOpen(id) {
        this.setState({
            collapsed: false,
            selected: id,
        });
    }

    getNavSteps() {
        let steps = [];
        if (this.props.steps) {
            this.props.steps.forEach(navStep => {
                steps.push(<NavStep {...navStep} key={navStep.id}
                    handleClick={this.props.handleStepClick}></NavStep>);
            });
        }
        return steps;
    }

    escFunction(event) {
        if (event.keyCode === 27) {
            this.props.handleEscPress();
        }
    }

    onDrawingClick(event) {
        event.originalEvent.preventDefault();
        event.originalEvent.stopPropagation();
        this.props.onDrawingClick(event);
    }
    onDrawingMove(event) {
        event.originalEvent.preventDefault();
        event.originalEvent.stopPropagation();
        this.props.onDrawingMove(event);
    }
}

export default MapView;