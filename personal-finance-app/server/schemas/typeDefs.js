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

    input UpdateTransactionInput {
        id: ID!
        type: String
        amount: Float
        category: String # Accepts the category name
        date: String
        description: String
    }

    # Queries for fetching data
    type Query {
        # Fetch the authenticated user
        getUser: User

        # Fetch all users
        getAllUsers: [User]

        # Fetch all transactions for the authenticated user
        getTransactions(userId: ID): [Transaction]

        # Fetch all categories (or filter by type)
        getCategories(type: String): [Category]
    }

    # Mutations for creating, updating, and deleting data
    type Mutation {
        # User signup and login
        signup(username: String!, email: String!, password: String!): Auth
        login(email: String!, password: String!): Auth

        # Transaction management
        addTransaction(input: TransactionInput!): Transaction
        updateTransaction(input: UpdateTransactionInput!): Transaction
        deleteTransaction(id: ID!): Transaction

        # Category management
        addCategory(name: String!, type: String!, description: String): Category
        deleteCategory(id: ID!): Category

        # Password management
        updatePassword(newPassword: String!): PasswordUpdateResponse
    }
`;

module.exports = typeDefs;
