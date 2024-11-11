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

export const ADD_TRANSACTION = gql`
    mutation AddTransaction($input: TransactionInput!) {
        addTransaction(input: $input) {
            _id
            type
            amount
            date
            description
            category {
                name
            }
        }
    }
`;

export const DELETE_TRANSACTION = gql`
    mutation DeleteTransaction($id: ID!) {
        deleteTransaction(id: $id) {
            _id
        }
    }
`;

export const ADD_CATEGORY = gql`
    mutation AddCategory($name: String!, $type: String!, $description: String) {
        addCategory(name: $name, type: $type, description: $description) {
            _id
            name
            type
            description
        }
    }
`;

export const UPDATE_PASSWORD = gql`
    mutation UpdatePassword($newPassword: String!) {
        updatePassword(newPassword: $newPassword) {
            message
        }
    }
`;

export const GET_USER_PROFILE = gql`
    query GetUserProfile {
        getUser {
            _id
            username
            email
            transactions {
                _id
                type
                amount
                date
                description
                category {
                    name
                }
            }
        }
    }
`;

export const GET_USER_ENTRIES = gql`
    query GetUserEntries {
        getTransactions {
            _id
            type
            amount
            date
            description
            category {
                name
            }
        }
    }
`;

export const GET_CATEGORIES = gql`
    query GetCategories {
        getCategories {
            _id
            name
            type
        }
    }
`;
