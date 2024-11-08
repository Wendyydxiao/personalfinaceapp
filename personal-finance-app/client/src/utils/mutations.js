import { gql } from "@apollo/client";

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
                username
                email
            }
        }
    }
`;

export const ADD_ENTRY = gql`
    mutation AddTransaction($input: TransactionInput!) {
        addTransaction(input: $input) {
            _id
            type
            amount
            date
            description
        }
    }
`;

export const DELETE_ENTRY = gql`
    mutation DeleteTransaction($id: ID!) {
        deleteTransaction(id: $id) {
            _id
        }
    }
`;

// Placeholder for future mutations - you can add this later as needed
export const UPDATE_PASSWORD = gql`
mutation UpdatePassword($id: ID!, $oldPassword: String!, $newPassword: String!) {
     updatePassword(id: $id, oldPassword: $oldPassword, newPassword: $newPassword) {
         message
     }
     }
 `;
