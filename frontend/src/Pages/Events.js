import React, { Component } from 'react';
import Modal from '../Components/Modal';
import Backdrop from '../Components/Backdrop';
import './Events.css'

class EventsPage extends Component {
  state = {
    creating: false,
  };

  handleCloseModal = () => {
    this.setState({ creating: false });
  };

  handleConfirm = () => {
    this.handleCloseModal();
  };

  startCreateEventHandler = () => {
    this.setState({ creating: true });
  };

  render() {
    const { creating } = this.state;

    return (
      <React.Fragment>
        <div className="events-control">
          <p>Share your own events!</p>
          <button className="btn" onClick={this.startCreateEventHandler}>Create Event</button>
        </div>
        {creating && (
          <Backdrop>
            <Modal
              onCancel={this.handleCloseModal}
              onConfirm={this.handleConfirm}
              title="Hello Events"
            >
              <p>
                Modal contents
              </p>
            </Modal>
          </Backdrop>
        )}
      </React.Fragment>

    );
  }  
}

export default EventsPage;
