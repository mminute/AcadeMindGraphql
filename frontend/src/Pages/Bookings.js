import React, { Component, Fragment } from 'react';
import AuthContext from '../context/auth-context';
import BookingsViewControl from '../Components/BookingsViewControl';
import Chart from '../Components/Chart';
import BookingList from '../Components/BookingList';
import Spinner from '../Components/Spinner';

class BookingsPage extends Component {
  static contextType = AuthContext;

  state = { bookings: [], isLoading: false, view: 'list' };

  componentDidMount() {
    this.fetchBookings();
  }

  handleChangeView = (viewType) => {
    this.setState({ view: viewType });
  }

  handleDeleteBooking = (bookingId) => {
    this.setState({ isLoading: true });

    const requestBody = {
      query: `
        mutation CancelBooking($id: ID!) {
          cancelBooking(bookingId: $id) {
            _id
            title
          }
        }
      `,
      variables: {
        id: bookingId,
      }
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
              price
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
    const { bookings, isLoading, view } = this.state;

    let contents = <Spinner />;
    if (!isLoading) {
      contents = view === 'list' ? (
        <BookingList bookings={bookings} onDelete={this.handleDeleteBooking} />
      ) : (
        <Chart bookings={bookings} />
      );
    }

    return (
      <Fragment>
        {!isLoading && <BookingsViewControl clickHandler={this.handleChangeView} currentView={view} />}

        {contents}
      </Fragment>
    )
  }  
}

export default BookingsPage;
