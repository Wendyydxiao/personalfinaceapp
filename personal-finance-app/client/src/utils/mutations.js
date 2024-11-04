import { gql } from '@apollo/client';

export const SIGNUP_USER = gql`
  mutation Signup($username: String!, $email: String!, $password: String!) {
    signup(username: $usrename, email: $email, password: $password) {
      token
      user {
        id
        email
        username
      }
    }
  }
`;
