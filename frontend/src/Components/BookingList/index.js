import React from 'react';
import './BookingList.css';

export default function BookingList(props) {
  const { bookings, onDelete } = props;

  return (
    <ul className="bookings_list">
      {bookings.map(booking => (
        <li className="bookings__item" key={booking._id}>
          <div>
            {booking.event.title} - {new Date(booking.createdAt).toLocaleDateString()}
          </div>
          <div>
            <button className="btn" onClick={() => onDelete(booking._id)}>
              Cancel
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
