import { useQuery } from '@apollo/react-hooks';
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


export default function ApolloEventsInterface({ children }) {
  const eventsData = useQuery(eventsQuery);

  return children(eventsData);
}
