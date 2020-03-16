import React from 'react';
import Events from '../Components/Events';
import EventsFetcher from '../Components/EventsFetcher';

export default (
  <EventsFetcher>
    {({ loading, error, data }) => (
      <Events apolloData={{ loading, error, data }} />
    )}
  </EventsFetcher>
);
