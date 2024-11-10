const User = require("../models/User");
const Transaction = require("../models/Transaction");
const Category = require("../models/Category");
const { AuthenticationError } = require("apollo-server-express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const JWT_SECRET = process.env.JWT_SECRET || "abc123";

const resolvers = {
    Query: {
        async getUser(_, __, context) {
            if (!context.user) {
                throw new AuthenticationError("Not authenticated");
            }
            try {
                return await User.findById(context.user.id).populate({
                    path: "transactions",
                    populate: { path: "category" },
                });
            } catch (err) {
                throw new Error(`User not found: ${err.message}`);
            }
        },
        async getTransactions(_, __, context) {
            if (!context.user) {
                throw new AuthenticationError("Not authenticated");
            }
            try {
                return await Transaction.find({
                    userId: context.user.id,
                }).populate("category");
            } catch (err) {
                throw new Error(`Unable to fetch transactions: ${err.message}`);
            }
        },
        async getCategories(_, __, context) {
            if (!context.user) {
                throw new AuthenticationError("Not authenticated");
            }
            try {
                return await Category.find();
            } catch (err) {
                throw new Error(`Unable to fetch categories: ${err.message}`);
            }
        },
    },

    Mutation: {
        async signup(_, { username, email, password }) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                throw new Error("Email already in use");
            }
            const user = await User.create({ username, email, password });
            const token = jwt.sign(
                { id: user._id, username, email },
                JWT_SECRET,
                {
                    expiresIn: "1h",
                }
            );
            return { token, user };
        },
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
        async updatePassword(_, { newPassword }, context) {
            if (!context.user) {
                throw new AuthenticationError("Not authenticated");
            }
            try {
                const hashedPassword = await bcrypt.hash(newPassword, 10);
                await User.findByIdAndUpdate(context.user.id, {
                    password: hashedPassword,
                });
                return { message: "Password updated successfully" };
            } catch (err) {
                throw new Error(`Failed to update password: ${err.message}`);
            }
        },
        async addTransaction(_, { input }, context) {
            if (!context.user) {
                throw new AuthenticationError("Not authenticated");
            }
            const { type, amount, date, description, category } = input;
            try {
                const normalizedType = type.toLowerCase();

                // Find or create the category
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

                // Create the transaction
                const transaction = await Transaction.create({
                    userId: context.user.id,
                    type: normalizedType,
                    amount,
                    date,
                    description,
                    category: categoryDoc._id,
                });

                // Update the user's transactions
                await User.findByIdAndUpdate(context.user.id, {
                    $push: { transactions: transaction._id },
                });

                return transaction.populate("category");
            } catch (err) {
                throw new Error(`Unable to add transaction: ${err.message}`);
            }
        },
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
        async addCategory(_, { name, type, description }, context) {
            if (!context.user) {
                throw new AuthenticationError("Not authenticated");
            }
            try {
                const normalizedType = type.toLowerCase();

                // Check if the category already exists
                let existingCategory = await Category.findOne({
                    name,
                    type: normalizedType,
                });
                if (existingCategory) {
                    return existingCategory; // Return the existing category
                }

                // Create a new category if it doesn't exist
                const newCategory = await Category.create({
                    name,
                    type: normalizedType,
                    description,
                });
                return newCategory;
            } catch (err) {
                throw new Error(`Unable to add category: ${err.message}`);
            }
        },
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
