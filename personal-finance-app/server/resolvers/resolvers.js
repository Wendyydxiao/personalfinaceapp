const User = require("../models/User");
const Transaction = require("../models/Transaction");
const Category = require("../models/Category");
const { AuthenticationError } = require("apollo-server-express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const JWT_SECRET = process.env.JWT_SECRET || "abc123";

const resolvers = {
    Query: {
        // Fetch the authenticated user's profile
        async getUser(_, __, context) {
            if (!context.user) {
                throw new AuthenticationError("Not authenticated");
            }
            try {
                return await User.findById(context.user.id).populate(
                    "transactions"
                );
            } catch (err) {
                throw new Error(`User not found: ${err.message}`);
            }
        },

        // Fetch all transactions for the authenticated user
        async getTransactions(_, { userId }, context) {
            if (!context.user) {
                throw new AuthenticationError("Not authenticated");
            }

            // Use the provided userId or fallback to the authenticated user's ID
            const targetUserId = userId || context.user.id;

            try {
                return await Transaction.find({
                    userId: targetUserId,
                }).populate("category");
            } catch (err) {
                throw new Error(`Unable to fetch transactions: ${err.message}`);
            }
        },

        // Fetch all categories, optionally filtered by type (income/expense)
        async getCategories(_, { type }, context) {
            if (!context.user) {
                throw new AuthenticationError("Not authenticated");
            }
            const query = type ? { type } : {};
            try {
                return await Category.find(query);
            } catch (err) {
                throw new Error(`Unable to fetch categories: ${err.message}`);
            }
        },
    },

    Mutation: {
        // Register a new user
        async signup(_, { username, email, password }) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                throw new Error("Email already in use");
            }
            const user = await User.create({ username, email, password });
            const token = jwt.sign(
                { id: user._id, username, email },
                JWT_SECRET,
                { expiresIn: "1h" }
            );
            return { token, user };
        },

        // Log in an existing user
        async login(_, { email, password }) {
            const user = await User.findOne({ email });
            if (!user) {
                throw new AuthenticationError("User not found");
            }
            const isValidPassword = await user.isCorrectPassword(password);
            if (!isValidPassword) {
                throw new AuthenticationError("Incorrect password");
            }
            const token = jwt.sign(
                { id: user._id, username: user.username, email },
                JWT_SECRET,
                { expiresIn: "1h" }
            );
            return { token, user };
        },

        // Add a transaction with dynamic category handling
        async addTransaction(_, { input }, context) {
            if (!context.user) {
                throw new AuthenticationError("Not authenticated");
            }

            const { type, amount, date, description, category } = input;

            try {
                const normalizedType = type.toLowerCase();

                let categoryDoc = await Category.findOne({
                    name: category,
                    type: normalizedType,
                });
                if (!categoryDoc) {
                    categoryDoc = await Category.create({
                        name: category,
                        type: normalizedType,
                    });
                }

                const transaction = await Transaction.create({
                    userId: context.user.id,
                    type: normalizedType,
                    amount,
                    date,
                    description,
                    category: categoryDoc._id,
                });

                await User.findByIdAndUpdate(context.user.id, {
                    $push: { transactions: transaction._id },
                });

                return transaction.populate("category");
            } catch (err) {
                throw new Error(`Unable to add transaction: ${err.message}`);
            }
        },

        // Update a transaction by ID
        async updateTransaction(_, { input }, context) {
            if (!context.user) {
                throw new AuthenticationError("Not authenticated");
            }

            const { id, type, amount, category, date, description } = input;

            try {
                // Find or create category if provided
                let categoryDoc;
                if (category) {
                    categoryDoc = await Category.findOne({
                        name: category,
                        type,
                    });
                    if (!categoryDoc) {
                        categoryDoc = await Category.create({
                            name: category,
                            type,
                        });
                    }
                }

                const updateData = {
                    ...(type && { type }),
                    ...(amount && { amount }),
                    ...(categoryDoc && { category: categoryDoc._id }),
                    ...(date && { date }),
                    ...(description && { description }),
                };

                return await Transaction.findByIdAndUpdate(id, updateData, {
                    new: true,
                }).populate("category");
            } catch (err) {
                throw new Error(`Unable to update transaction: ${err.message}`);
            }
        },

        // Delete a transaction by ID
        async deleteTransaction(_, { id }, context) {
            if (!context.user) {
                throw new AuthenticationError("Not authenticated");
            }

            try {
                const transaction = await Transaction.findByIdAndDelete(id);
                if (!transaction) throw new Error("Transaction not found");

                await User.findByIdAndUpdate(context.user.id, {
                    $pull: { transactions: id },
                });
                return transaction;
            } catch (err) {
                throw new Error(`Unable to delete transaction: ${err.message}`);
            }
        },

        // Add a new category
        async addCategory(_, { name, type, description }, context) {
            if (!context.user) {
                throw new AuthenticationError("Not authenticated");
            }
            try {
                return await Category.create({ name, type, description });
            } catch (err) {
                throw new Error(`Unable to add category: ${err.message}`);
            }
        },

        // Delete a category by ID
        async deleteCategory(_, { id }, context) {
            if (!context.user) {
                throw new AuthenticationError("Not authenticated");
            }
            try {
                const category = await Category.findByIdAndDelete(id);
                if (!category) throw new Error("Category not found");
                return category;
            } catch (err) {
                throw new Error(`Unable to delete category: ${err.message}`);
            }
        },
    },
};

module.exports = resolvers;
