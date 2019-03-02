import React, { Component } from 'react';
import MapView from './map/MapView';
import Modal from 'react-bootstrap/Modal';

import './App.css';

class App extends Component {

    state = {
        isInitial: false,
    }

    componentDidMount() {
        document.addEventListener("keydown", this.escFunction, false);
        this.handleShow()
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", this.escFunction, false);
    }

    handleClose = () => {
        this.setState({ isInitial: false });
    }

    handleShow = () => {
        this.setState({ isInitial: true });
    }

    escFunction = (e) => {
        if (e.keyCode === 27) {
            this.handleClose();
        }
    }

    render() {
        return (
            <div className="App">
                <MapView></MapView>
                <Modal show={this.state.isInitial} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title className="initialModalTitle">Ahoy Captain!</Modal.Title>
                    </Modal.Header>

                    <Modal.Body className="initialModalBody">
                        <img src={'/icon.png'} alt={''} width="300rem" />
                        <p>Press <b>Esc</b> to start</p>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}

export default App;
