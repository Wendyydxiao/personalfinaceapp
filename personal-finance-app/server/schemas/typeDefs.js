const { gql } = require("apollo-server-express");

const typeDefs = gql`
    # User typedef
    type User {
        _id: ID!
        username: String!
        email: String!
        transactions: [Transaction]
        createdAt: String
    }

    # Transaction typedef
    type Transaction {
        _id: ID!
        userId: ID!
        type: String!
        amount: Float!
        category: Category!
        date: String
        description: String
    }

    # Category typedef
    type Category {
        _id: ID!
        name: String!
        type: String!
        description: String
    }

    # Auth for login response
    type Auth {
        token: String!
        user: User
    }

    # Response for password update
    type PasswordUpdateResponse {
        message: String!
    }

    # Input types for better reusability
    input SignupInput {
        username: String!
        email: String!
        password: String!
    }

    input TransactionInput {
        type: String!
        amount: Float!
        category: String! # Accepts the category name
        date: String
        description: String
    }

    # Queries for fetching data
    type Query {
        getUser: User
        getTransactions: [Transaction]
        getCategories: [Category]
    }

    # Mutations for creating, updating, and deleting data
    type Mutation {
        signup(username: String!, email: String!, password: String!): Auth
        login(email: String!, password: String!): Auth
        addTransaction(input: TransactionInput!): Transaction
        deleteTransaction(id: ID!): Transaction
        addCategory(name: String!, type: String!, description: String): Category
    }
`;

module.exports = typeDefs;
