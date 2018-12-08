import React, { Component } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

export default class ScenarioStep extends Component {
    render() {
        return (
            <ListItem>
                <ListItemText onClick={this.onClick.bind(this)}
                    primary={`(${[...this.props.positions[0]]}) > (${[...this.props.positions[1]]})`}>
                </ListItemText>
                <ListItemSecondaryAction>
                    <IconButton aria-label="Delete" onClick={this.onDelete.bind(this)}>
                        <DeleteIcon />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
        );
    }

    onClick(event) {
        event.preventDefault();
        event.stopPropagation();
        this.props.onClick(this.props.id);
    }

    onDelete(event) {
        console.log(event);
        event.preventDefault();
        event.stopPropagation();
        this.props.onRemove(this.props.id);
    }
}