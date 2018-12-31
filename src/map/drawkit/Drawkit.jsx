import React, { Component } from 'react';
import "./Drawkit.css";
import { Toolbar, Card, Divider } from '@material-ui/core';
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
        type: "Current",
        acronyms: "CRNT",
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
                <span>
                    <a
                        key={tool.acronyms}
                        className={`drawkitTool draw-${tool.acronyms.toLocaleLowerCase()} ${selectedClass}`}
                        href="#"
                        title={`Draw a ${tool.acronyms}`}
                        onClick={() => { this.onSelectTool(tool) }}>
                        {tool.acronyms}
                    </a>
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