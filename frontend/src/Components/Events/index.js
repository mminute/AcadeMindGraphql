import React, { Component } from 'react';
import Modal from '../Modal';
import Backdrop from '../Backdrop';
import AuthContext from '../../context/auth-context';
import EventList from './EventList';
import Spinner from '../Spinner';
import './Events.css'

class EventsPage extends Component {
  static contextType = AuthContext;

  isActive = true;

  state = {
    creating: false,
    events: [],
    isLoading: false,
    selectedEvent: null,
  };

  constructor(props) {
    super(props);
    this.titleRef = React.createRef();
    this.priceRef = React.createRef();
    this.dateRef = React.createRef();
    this.descriptionRef = React.createRef();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.eventsData?.data?.events && !prevProps.eventsData?.data?.events) {
      this.setState({ events: [...prevState.events, ...this.props.eventsData.data.events] })
    }
  }

  componentWillUnmount() {
    this.isActive = false;
  }

  handleBookEvent = () => {
    if (!this.context.token) {
      this.handleCloseDetailsModal();
      return;
    }

    const { _id } = this.state.selectedEvent;
    const { token } = this.context;

    const requestBody = {
      query: `
        mutation {
          bookEvent(eventId: "${_id}") {
            _id
            createdAt
            updatedAt
          }
        }
      `,
    };

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    }).then(res => {
      if (![200, 201].includes(res.status)) {
        throw new Error('Failed!', res);
      }

      return res.json();
    })
    .then(resData => {
      this.handleCloseDetailsModal();
      console.log(resData);
    }).catch(err => {
      this.handleCloseDetailsModal();
      console.log(err);
    });
  };

  handleCloseModal = () => {
    this.setState({ creating: false });
  };

  handleCloseDetailsModal = () => {
    this.setState({ selectedEvent: null });
  }

  handleConfirm = () => {
    const title = this.titleRef.current.value;
    const price = this.priceRef.current.value;
    const date = this.dateRef.current.value;
    const description = this.descriptionRef.current.value;

    const event = {
      date,
      description,
      price,
      title,
    };

    if ([date, description, price, title].map(itm => itm.trim().length === 0).includes(true)) {
      return;
    }

    this.handleCreateEvent(event);

    this.handleCloseModal();
  };

  handleCreateEvent({ date, description, price, title }) {
    console.log(price, typeof price);
    const requestBody = {
      query: `
        mutation CreateEvent($date: String!, $description: String!, $price: Float!, $title: String!) {
          createEvent(eventInput: {date: $date, description: $description, price: $price, title: $title}) {
            _id
            title
            description
            price
            date
          }
        }
      `,
      variables: {
        date,
        description,
        price: parseFloat(price),
        title,
      }
    };

    const { token } = this.context;

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    }).then(res => {
      if (![200, 201].includes(res.status)) {
        throw new Error('Failed!');
      }
      return res.json();
    })
    .then(resData => {
      this.setState(prevState => {
        const existingEvents = prevState.events;
        const newEvent = {
          ...resData.data.createEvent,
          creator: { _id: this.context.userId },   
        };

        return { events: [...existingEvents, newEvent] };
      });
    }).catch(err => {
      console.log(err);
    });
  }

  startCreateEventHandler = () => {
    this.setState({ creating: true });
  };

  showDetailHandler = (eventId) => {
    this.setState((prevState) => {
      const selectedEvent = prevState.events.find(evt => evt._id === eventId);
      return { selectedEvent };
    });
  };

  render() {
    const { creating, events, isLoading, selectedEvent } = this.state;

    return (
      <React.Fragment>
        {this.context.token && (
          <div className="events-control">
            <p>Share your own events!</p>
            <button className="btn" onClick={this.startCreateEventHandler}>Create Event</button>
          </div>
        )}

        {isLoading ? <Spinner /> : (
          <EventList
            events={events}
            userId={this.context.userId}
            onClick={this.showDetailHandler}
          />
        )}

        {selectedEvent && (
          <Backdrop>
            <Modal
              confirmText={this.context.token ? 'Book' : 'Confirm'}
              onCancel={this.handleCloseDetailsModal}
              onConfirm={this.handleBookEvent}
              title={selectedEvent.title}
            >
              <h1>{selectedEvent.title}</h1>
              <h2>{`$${selectedEvent.price}`} - {new Date(selectedEvent.date).toLocaleDateString()}</h2>
              <p>{selectedEvent.description}</p>
            </Modal>
          </Backdrop>
        )}

        {creating && (
          <Backdrop>
            <Modal
              confirmText="Confirm"
              onCancel={this.handleCloseModal}
              onConfirm={this.handleConfirm}
              title="Hello Events"
            >
              <form action="">
                <div className="form-control">
                  <label htmlFor="title">Event title</label>
                  <input type="text" id="title" ref={this.titleRef}/>
                </div>
                <div className="form-control">
                  <label htmlFor="price">Price</label>
                  <input type="number" id="price" ref={this.priceRef}/>
                </div>
                <div className="form-control">
                  <label htmlFor="date">Date</label>
                  <input type="datetime-local" id="date" ref={this.dateRef}/>
                </div>
                <div className="form-control">
                  <label htmlFor="description">Description</label>
                  <textarea id="description" rows="4" ref={this.descriptionRef}/>
                </div>
              </form>
            </Modal>
          </Backdrop>
        )}
      </React.Fragment>

    );
  }  
}

export default EventsPage;
