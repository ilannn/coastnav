import React, { Component } from 'react';
import './Nav.css';

class Nav extends Component {
    render() {
        return <ul className="NavContainer">
            <li>Edit</li>
            <li>Scenario</li>
        </ul>
    }
}

export default Nav;