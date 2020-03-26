import { useMutation, useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

const eventsQuery = gql`
  {
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
`;

const createEventMutation = gql`
  mutation CreateEvent($date: String!, $description: String!, $price: Float!, $title: String!) {
    createEvent(eventInput: {date: $date, description: $description, price: $price, title: $title}) {
      _id
      title
      description
      price
      date
    }
  }
`;


export default function ApolloEventsInterface({ children }) {
  const eventsData = useQuery(eventsQuery);

  const [
    createEventFn,
    {
      data: createEventData,
      loading: mutationLoading,
      error: mutationError,
    },
  ] = useMutation(createEventMutation);

  return children({
    createEventMutation: {
      createEventData,
      mutationError,
      mutationLoading,
      runMutation: createEventFn,
    },
    eventsData,
  });
}
