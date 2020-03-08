import React from 'react';
import './EventItem.css';

export default function EventItem({ title, isCreator, price, date, onClick }) {
  return (
    <li className="event__list-item">
      <div>
        <h1>{title}</h1>
        <h2>{`$${price}`} - {new Date(date).toLocaleDateString()}</h2>
      </div>
      <div>
        {isCreator
          ? <p>You own this event</p>
          : <button className="btn" onClick={onClick}>View Details</button>
        }
      </div>
    </li>
  );
}
