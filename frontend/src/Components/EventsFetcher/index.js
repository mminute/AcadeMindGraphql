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

export default function EventFetcher({ children }) {
  const { loading, error, data } = useQuery(eventsQuery);

  return children({ loading, error, data });
}
