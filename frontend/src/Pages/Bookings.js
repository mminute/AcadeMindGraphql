import React, { Component, Fragment } from 'react';
import AuthContext from '../context/auth-context';
import BookingList from '../Components/BookingList';
import Spinner from '../Components/Spinner/Spinner';

class BookingsPage extends Component {
  static contextType = AuthContext;

  state = { bookings: [], isLoading: false };

  componentDidMount() {
    this.fetchBookings();
  }

  handleDeleteBooking = (bookingId) => {
    this.setState({ isLoading: true });

    const requestBody = {
      query: `
        mutation {
          cancelBooking(bookingId: "${bookingId}") {
            _id
            title
          }
        }
      `,
    };

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.context.token,
      },
    }).then(res => {
      if (![200, 201].includes(res.status)) {
        throw new Error('Failed!')
      }

      return res.json();
    })
    .then(resData => {
      this.setState(prevState => {
        const updatedBookings = prevState.bookings.filter(itm => itm._id !== bookingId);

        return { bookings: updatedBookings, isLoading: false };
      });

    }).catch(err => {
      this.setState({ isLoading: false });
      console.log(err);
    });
  }

  fetchBookings = () => {
    this.setState({ isLoading: true });

    const requestBody = {
      query: `
        query {
          bookings {
            _id
            createdAt
            event {
              _id
              title
              date
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
        'Authorization': 'Bearer ' + this.context.token,
      },
    }).then(res => {
      if (![200, 201].includes(res.status)) {
        throw new Error('Failed!')
      }

      return res.json();
    })
    .then(resData => {
      this.setState({ isLoading: false });
      const bookings = resData.data.bookings;
      this.setState({ bookings });
    }).catch(err => {
      this.setState({ isLoading: false });
      console.log(err);
    });
  };

  render() {
    const { bookings, isLoading } = this.state;

    return (
      <Fragment>
        {isLoading ? <Spinner /> : (
          <BookingList bookings={bookings} onDelete={this.handleDeleteBooking} />
        )}
      </Fragment>
    )
  }  
}

export default BookingsPage;
