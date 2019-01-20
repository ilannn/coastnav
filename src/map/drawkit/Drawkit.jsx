import React, { Component } from 'react';
import "./Drawkit.css";
import { Card, Divider, Button } from '@material-ui/core';
import { StepType } from '../../models/steps';
import { ExtraType } from '../../models/extras';

const drawkitStepTools = [
    {
        type: StepType.GUIDELINE,
        acronyms: "GL",
        matIcon: "face",
        options: {
            color: 'grey',
            dashArray: '4',
        },
    },
    {
        type: StepType.TB,
        acronyms: "TB",
        matIcon: "face",
        options: {
        },
    },
    {
        type: StepType.COG,
        acronyms: "COG",
        matIcon: "face",
        options: {
            color: "black",
        },
    },
    {
        type: StepType.CRNT,
        acronyms: "CRNT",
        matIcon: "face",
        options: {
            color: "white",
        },
    },
    {
        type: StepType.TC,
        acronyms: "TC",
        matIcon: "face",
        options: {
            color: "white",
        },
    },
];

const drawkitExtrasTools = [
    {
        type: ExtraType.RNG,
        acronyms: "RNG",
        matIcon: "face",
        options: {
        },
    },
    {
        type: ExtraType.DR,
        acronyms: "DR",
        matIcon: "face",
        options: {
        },
    },
    {
        type: ExtraType.FIX,
        acronyms: "FIX",
        matIcon: "face",
        options: {
        },
    },
    {
        type: ExtraType.R,
        acronyms: "R",
        matIcon: "face",
        options: {
        },
    },
];

class Drawkit extends Component {
    render() {
        let drawkitTools = this.getDrawkitTools();
        return (<section>
            <Card className="drawkitToolList">
                {drawkitTools}
            </Card>
            <Card className="drawkitClearAll">
                <Button 
                    title={"Clear All"}
                    onClick={this.props.onClearAll}>
                    <i className="material-icons">delete_sweep</i>
                </Button>
            </Card>
            {this.props.children}
        </section>)
    }

    getDrawkitTools() {
        return drawkitStepTools.map((tool, index) => {
            let selectedClass =
                this.props.selectedTool &&
                    this.props.selectedTool.type === tool.type
                    ? 'selected' : '';
            let divider = index !== drawkitStepTools.length - 1 ? <Divider /> : null;
            return (
                <span key={index}>
                    <Button
                        className={`drawkitTool draw-${tool.acronyms.toLocaleLowerCase()} ${selectedClass}`}
                        title={`Draw a ${tool.acronyms}`}
                        variant={this.props.selectedTool && this.props.selectedTool.type === tool.type ? 'contained' : 'text'}
                        onClick={() => { this.onSelectTool(tool) }}>
                        {tool.acronyms}

                    </Button>
                    {divider}
                </span>
            )
        });
    }

    onSelectTool(tool) {
        this.props.onSelectTool(tool);
    }
}

export default Drawkit;