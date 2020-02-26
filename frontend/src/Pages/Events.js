import React, { Component } from 'react';
import Modal from '../Components/Modal';
import Backdrop from '../Components/Backdrop';
import AuthContext from '../context/auth-context';
import './Events.css'

class EventsPage extends Component {
  static contextType = AuthContext;

  state = {
    // TODO: default to false
    creating: true,
    events: [],
  };

  constructor(props) {
    super(props);
    this.titleRef = React.createRef();
    this.priceRef = React.createRef();
    this.dateRef = React.createRef();
    this.descriptionRef = React.createRef();
  }

  componentDidMount() {
    this.fetchEvents();
  }

  handleCloseModal = () => {
    this.setState({ creating: false });
  };

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
    const requestBody = {
      query: `
        mutation {
          createEvent(eventInput: {date: "${date}", description: "${description}", price: ${price}, title: "${title}"}) {
            _id
            title
            description
            price
            date
            creator {
              _id
              email
            }
          }
        }
      `,
    };

    const { token } = this.context;

    console.log('about to submit new event...');
    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    }).then(res => {
      if (![200, 201].includes(res.status)) {
        console.log(res);
        throw new Error('Failed!');
      }
      console.log('handleCreateEvent res.json');
      return res.json();
    })
    .then(resData => {
      console.log('handleCreateEvent onSuccess');
      this.fetchEvents();
    }).catch(err => {
      console.log(err);
    });
  }

  fetchEvents() {
    console.log('top of fetchEvents');
    const requestBody = {
      query: `
        query {
          events {
            _id
            title
            description
            date
            price
            creator {
              _id
              email
            }
          }
        }
      `,
    };

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(res => {
      console.log('fetchEvents -> got a response');
      if (![200, 201].includes(res.status)) {
        throw new Error('Failed!')
      }

      return res.json();
    })
    .then(resData => {
      console.log('on success');
      const events = resData.data.events;
      this.setState({ events });
    }).catch(err => {
      console.log('on error');
      console.log(err);
    });
  }

  startCreateEventHandler = () => {
    this.setState({ creating: true });
  };

  render() {
    const { creating, events } = this.state;

    return (
      <React.Fragment>
        {this.context.token && (
          <div className="events-control">
            <p>Share your own events!</p>
            <button className="btn" onClick={this.startCreateEventHandler}>Create Event</button>
          </div>
        )}

        <ul className="events__list">
          {events.map((event, idx) => (
            <li className="events__list-item" key={`event-itme-${idx}`}>{event.title}</li>
          ))}
        </ul>

        {creating && (
          <Backdrop>
            <Modal
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
