import React from 'react';
import EventItem from './EventItem';
import './EventList.css';

export default function EventList({ events, userId, onClick }) {
  return (
    <ul className="event__list">
      {events.map((event) => (
        <EventItem
          date={event.date}
          isCreator={event.creator._id === userId}
          key={`event-item-${event._id}`}
          onClick={() => onClick(event._id)}
          price={event.price}
          title={event.title}
        />
      ))}
    </ul>
  );
}
