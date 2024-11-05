import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

export const SIGNUP_USER = gql`
  mutation Signup($username: String!, $email: String!, $password: String!) {
    signup(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        email
        username
      }
    }
  }
`;

export const ADD_ENTRY = gql`
  mutation AddEntry($type: String!, $amount: Number!, $date: Date!, $description: String) {
    addEntry(type: $type, category: $category, amount: $amount, date: $date, description: $description) {
      _id
      type
      category
      amount
      date
      description
    }
  }
`;

export const DELETE_ENTRY = gql`
  mutation DeleteEntry($id: ID!) {
    deleteEntry(_id: $id) {
      _id
    }
  }
`;


export const UPDATE_PASSWORD = gql
  // mutation UpdatePassword //ADD MUTATION HERE//
