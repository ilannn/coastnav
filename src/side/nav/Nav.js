import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';

import './Nav.css';

function TabContainer(props) {
    return (
        <Typography component="div" style={{ padding: 8 * 3 }}>
            {props.children}
        </Typography>
    );
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired,
};

class Nav extends Component {

    render() {
        return <div>
            <Paper square>
                <Tabs value={+this.props.isEdit} onChange={this.handleChange} centered>
                    <Tab value={1} label={this.props.tabs[0].label} disabled={!this.props.isEdit}/>
                    <Tab value={0} label={this.props.tabs[1].label} onClick={this.props.tabs[1].onClick} />
                </Tabs>
            </Paper>
            {this.props.isEdit && <TabContainer>
                {this.props.tabs[0].content}
            </TabContainer>}
            {!this.props.isEdit && <TabContainer>
                {this.props.tabs[1].content}    
            </TabContainer>}
        </div>

    }
}

export default Nav;