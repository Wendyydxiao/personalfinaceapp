const User = require("../models/User");
const Transaction = require("../models/Transaction");
const Category = require("../models/Category");
const { AuthenticationError } = require("apollo-server-express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Hardcoded JWT secret key for now
const JWT_SECRET = "your_jwt_secret_key";

const resolvers = {
    Query: {
        // Fetch a single user by ID and populate their transactions
        async getUser(_, { id }, context) {
            if (!context.user) {
                throw new AuthenticationError("Not authenticated");
            }
            try {
                return await User.findById(id).populate("transactions");
            } catch (err) {
                throw new Error(`User not found: ${err.message}`);
            }
        },

        // Fetch all users and populate their transactions
        async getAllUsers(_, __, context) {
            if (!context.user) {
                throw new AuthenticationError("Not authenticated");
            }
            try {
                return await User.find().populate("transactions");
            } catch (err) {
                throw new Error(`Unable to fetch users: ${err.message}`);
            }
        },

        // Fetch all transactions for a specific user by their ID, populating each transaction's category
        async getTransactions(_, { userId }, context) {
            if (!context.user) {
                throw new AuthenticationError("Not authenticated");
            }
            try {
                return await Transaction.find({ userId }).populate("category");
            } catch (err) {
                throw new Error(`Unable to fetch transactions: ${err.message}`);
            }
        },

        // Fetch all categories, with an optional filter by type (income or expense)
        async getCategories(_, { type }) {
            const query = type ? { type } : {};
            try {
                return await Category.find(query);
            } catch (err) {
                throw new Error(`Unable to fetch categories: ${err.message}`);
            }
        },
    },

    Mutation: {
        // Register a new user, hashing their password and generating a JWT
        // Signup Resolver
        async signup(_, { username, email, password }) {
            try {
                console.log("Checking if user already exists...");
                const existingUser = await User.findOne({ email });
                if (existingUser) {
                    throw new Error("Email already in use");
                }

                console.log("Creating new user...");
                const user = await User.create({
                    username,
                    email,
                    password, // No manual hashing here, let the pre-save hook do it
                    createdAt: new Date().toISOString(),
                });

                console.log("Generating JWT...");
                const token = jwt.sign(
                    {
                        id: user._id,
                        username: user.username,
                        email: user.email,
                    },
                    JWT_SECRET,
                    {
                        expiresIn: "1h",
                    }
                );

                console.log("User signup successful");
                return { token, user };
            } catch (err) {
                console.error("Signup error:", err);
                throw new Error(`Unable to signup user: ${err.message}`);
            }
        },

        // Login Resolver
        async login(_, { email, password }) {
            console.log("Logging in user...");
            const user = await User.findOne({ email });
            if (!user) {
                throw new AuthenticationError("User not found");
            }

            console.log("Comparing password...");
            const isValidPassword = await bcrypt.compare(
                password,
                user.password
            );
            console.log("Is valid password:", isValidPassword);

            if (!isValidPassword) {
                throw new AuthenticationError("Incorrect password");
            }

            const token = jwt.sign(
                { id: user._id, username: user.username, email: user.email },
                JWT_SECRET,
                {
                    expiresIn: "1h",
                }
            );
            console.log("Login successful, token generated");
            return { token, user };
        },

        // Add a new transaction for a user, linking it to the specified category
        async addTransaction(_, { input }, context) {
            if (!context.user) {
                throw new AuthenticationError("Not authenticated");
            }

            const { userId, type, amount, categoryId, date, description } =
                input;

            try {
                const transaction = new Transaction({
                    userId,
                    type,
                    amount,
                    category: categoryId,
                    date,
                    description,
                });
                await transaction.save();

                await User.findByIdAndUpdate(userId, {
                    $push: { transactions: transaction._id },
                });

                return await transaction.populate("category");
            } catch (err) {
                throw new Error(`Unable to add transaction: ${err.message}`);
            }
        },

        // Update specific fields of an existing transaction by ID
        async updateTransaction(_, { input }, context) {
            if (!context.user) {
                throw new AuthenticationError("Not authenticated");
            }

            const { id, type, amount, categoryId, date, description } = input;

            const updateData = {
                ...(type && { type }),
                ...(amount && { amount }),
                ...(categoryId && { category: categoryId }),
                ...(date && { date }),
                ...(description && { description }),
            };

            try {
                return await Transaction.findByIdAndUpdate(id, updateData, {
                    new: true,
                }).populate("category");
            } catch (err) {
                throw new Error(`Unable to update transaction: ${err.message}`);
            }
        },

        // Delete a transaction by ID and remove its reference from the user's transactions
        async deleteTransaction(_, { id }, context) {
            if (!context.user) {
                throw new AuthenticationError("Not authenticated");
            }

            try {
                const transaction = await Transaction.findByIdAndDelete(id);
                if (!transaction) throw new Error("Transaction not found");

                await User.findByIdAndUpdate(transaction.userId, {
                    $pull: { transactions: id },
                });

                return transaction;
            } catch (err) {
                throw new Error(`Unable to delete transaction: ${err.message}`);
            }
        },

        // Add a new category with a specified name, type, and description
        async addCategory(_, { name, type, description }, context) {
            if (!context.user) {
                throw new AuthenticationError("Not authenticated");
            }

            try {
                const category = new Category({ name, type, description });
                await category.save();
                return category;
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
