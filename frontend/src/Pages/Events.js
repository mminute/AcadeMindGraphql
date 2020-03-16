import React from 'react';
import Events from '../Components/Events';
import EventsFetcher from '../Components/Events/EventsFetcher';

export default function EventsWrapper() {
  return (
    <EventsFetcher>
      {(eventsData) => (
        <Events eventsData={eventsData} />
      )}
    </EventsFetcher>
  );
}
