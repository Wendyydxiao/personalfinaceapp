// server/resolvers/resolvers.js

const User = require("../models/User");
const Transaction = require("../models/Transaction");
const Category = require("../models/Category");
const {
    AuthenticationError,
    UserInputError,
} = require("apollo-server-express");
const { signToken } = require("../utils/auth");
const bcrypt = require("bcrypt");

const resolvers = {
    Query: {
        // Fetch a single user by ID and populate their transactions
        async getUser(_, { id }) {
            try {
                const user = await User.findById(id).populate("transactions");
                if (!user) {
                    throw new Error("User not found");
                }
                return user;
            } catch (err) {
                throw new Error("User not found");
            }
        },

        // Fetch all users and populate their transactions
        async getAllUsers() {
            try {
                return await User.find().populate("transactions");
            } catch (err) {
                throw new Error("Unable to fetch users");
            }
        },

        // Fetch all transactions for a specific user by their ID, populating each transaction's category
        async getTransactions(_, { userId }) {
            try {
                return await Transaction.find({ userId }).populate("category");
            } catch (err) {
                throw new Error("Unable to fetch transactions");
            }
        },

        // Fetch all categories, with an optional filter by type (income or expense)
        async getCategories(_, { type }) {
            const query = type ? { type } : {};
            try {
                return await Category.find(query);
            } catch (err) {
                throw new Error("Unable to fetch categories");
            }
        },
    },

    Mutation: {
        // Register a new user, hashing their password and generating a JWT
        async signup(_, { username, email, password }) {
            try {
                // Check if user already exists by email
                const existingUser = await User.findOne({ email });
                if (existingUser) {
                    throw new UserInputError("Email already in use");
                }

                // Create new user (password will be hashed by the pre-save middleware)
                const user = await User.create({
                    username,
                    email,
                    password,
                    createdAt: new Date().toISOString(),
                });

                // Generate JWT for the new user
                const token = signToken(user);
                return { token, user }; // Return the user data and JWT
            } catch (err) {
                throw new Error("Unable to create user");
            }
        },

        // Authenticate a user by providing their email and password, and generate a JWT
        async login(_, { email, password }) {
            try {
                // Check if a user with the provided email exists
                const user = await User.findOne({ email });
                if (!user) {
                    throw new AuthenticationError("Invalid email or password");
                }

                // Validate the password against the stored hash
                const isValidPassword = await bcrypt.compare(
                    password,
                    user.password
                );
                if (!isValidPassword) {
                    throw new AuthenticationError("Invalid email or password");
                }

                // Generate a JWT token for the authenticated user
                const token = signToken(user);
                return { token, user }; // Return the token and user data
            } catch (err) {
                throw new Error("Unable to login");
            }
        },

        // Add a new transaction for a user, linking it to the specified category
        async addTransaction(
            _,
            { userId, type, amount, category, date, description }
        ) {
            try {
                // Create new transaction with the provided data
                const transaction = new Transaction({
                    userId,
                    type,
                    amount,
                    category,
                    date,
                    description,
                });
                await transaction.save(); // Save the transaction to the database

                // Add the transaction reference to the user's transaction array
                await User.findByIdAndUpdate(userId, {
                    $push: { transactions: transaction._id },
                });

                return await transaction.populate("category"); // Return the transaction with the category populated
            } catch (err) {
                throw new Error("Unable to add transaction");
            }
        },

        // Update specific fields of an existing transaction by ID
        async updateTransaction(
            _,
            { id, type, amount, categoryId, date, description }
        ) {
            // Build an update object with only the fields that are provided
            const updateData = {
                ...(type && { type }),
                ...(amount && { amount }),
                ...(categoryId && { category: categoryId }),
                ...(date && { date }),
                ...(description && { description }),
            };

            try {
                // Find the transaction by ID and apply the updates, returning the updated transaction
                return await Transaction.findByIdAndUpdate(id, updateData, {
                    new: true,
                }).populate("category"); // Populate the category field
            } catch (err) {
                throw new Error("Unable to update transaction");
            }
        },

        // Delete a transaction by ID and remove its reference from the user's transactions
        async deleteTransaction(_, { id }) {
            try {
                // Find and delete the transaction by ID
                const transaction = await Transaction.findByIdAndDelete(id);
                if (!transaction) throw new Error("Transaction not found");

                // Remove the transaction reference from the user's transactions array
                await User.findByIdAndUpdate(transaction.userId, {
                    $pull: { transactions: id },
                });
                return transaction; // Return the deleted transaction
            } catch (err) {
                throw new Error("Unable to delete transaction");
            }
        },

        // Add a new category with a specified name, type, and description
        async addCategory(_, { name, type, description }) {
            try {
                // Create and save the new category
                const category = new Category({
                    name,
                    type,
                    description,
                });
                await category.save();
                return category; // Return the newly created category
            } catch (err) {
                throw new Error("Unable to add category");
            }
        },

        // Delete a category by ID
        async deleteCategory(_, { id }) {
            try {
                // Find and delete the category by ID
                const category = await Category.findByIdAndDelete(id);
                if (!category) throw new Error("Category not found");
                return category; // Return the deleted category
            } catch (err) {
                throw new Error("Unable to delete category");
            }
        },
    },
};

module.exports = resolvers;
