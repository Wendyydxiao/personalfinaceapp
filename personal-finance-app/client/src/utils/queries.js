import {gql} from '@apollo/client';

export const GET_USER_ENTRIES = gql`
  query GetUserEntries {
    userEntries {
      _id
      type
      category
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
