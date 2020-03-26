import React from 'react';
import Events from '../Components/Events';
import ApolloEventsInterface from '../Components/Events/ApolloEventsInterface';

export default function EventsWrapper() {
  return (
    <ApolloEventsInterface>
      {({ createEventMutation, eventsData }) => (
        <Events
          createEventMutation={createEventMutation}
          eventsData={eventsData}
        />
      )}
    </ApolloEventsInterface>
  );
}
