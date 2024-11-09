import {gql} from '@apollo/client';

export const GET_USER_ENTRIES = gql`
  query getTranscations ($userId: ID!) {
    getTransactions(userId: $userId) {
      _id
      type
      amount
      date
      description
    }
  }
`;

export const GET_USER_PROFILE = gql`
  query GetUserProfile {
    getUser {
      _id
      username
      email
    }
  }
`;
