import React, { Component } from 'react';
import "./Drawkit.css";
import { Card, Divider, Button } from '@material-ui/core';
import { StepType } from '../../models/steps';

const drawkitTools = [
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
]

class Drawkit extends Component {
    render() {
        let drawkitTools = this.getDrawkitTools();
        return (<section>
            <Card className="drawkitToolList">
                {drawkitTools}
            </Card>
            <Card>
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
        return drawkitTools.map((tool, index) => {
            let selectedClass =
                this.props.selectedTool &&
                    this.props.selectedTool.type === tool.type
                    ? 'selected' : '';
            let divider = index !== drawkitTools.length - 1 ? <Divider /> : null;
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