import React, { Component } from 'react';
import "./Drawkit.css";
import { Toolbar } from '@material-ui/core';

const drawkitTools = [
    {
        name: "Guide Line",
        acronyms: "GL",
        matIcon: "face",
        options: {
            color: 'grey',
            dashArray: '4',
        },
    },
    {
        name: "TB",
        acronyms: "TB",
        matIcon: "face",
        options: {
        },
    },
    {
        name: "Cog",
        acronyms: "COG",
        matIcon: "face",
        options: {
            color: "black",
        },
    },
    {
        name: "Current",
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
            <div className="drawkitToolList">
                {drawkitTools}
            </div>
            {this.props.children}
        </section>)
    }

    getDrawkitTools() {
        return drawkitTools.map(tool => {
            return (
                <a
                    className={`drawkitTool draw-${tool.name.toLocaleLowerCase()}`}
                    href="#"
                    title={`Draw a ${tool.name}`}
                    onClick={() => { this.onSelectTool(tool) }}>
                    {tool.name}
                </a>
            )
        });
    }

    onSelectTool(tool) {
        this.props.onSelectTool(tool);
    }
}

export default Drawkit;