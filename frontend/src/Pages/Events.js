import React from 'react';
import Events from '../Components/Events';
import ApolloEventsInterface from '../Components/Events/ApolloEventsInterface';

export default function EventsWrapper() {
  return (
    <ApolloEventsInterface>
      {(eventsData) => (
        <Events eventsData={eventsData} />
      )}
    </ApolloEventsInterface>
  );
}
