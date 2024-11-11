const Transaction = require("../models/Transaction");
const Category = require("../models/Category");
const User = require("../models/User");
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
            return User.findById(context.user.id).populate({
                path: "transactions",
                populate: { path: "category" },
            });
        },
        async getTransactions(_, __, context) {
            if (!context.user) {
                throw new AuthenticationError("Not authenticated");
            }
            return Transaction.find({ userId: context.user.id }).populate(
                "category"
            );
        },
        async getCategories(_, __, context) {
            if (!context.user) {
                throw new AuthenticationError("Not authenticated");
            }
            return Category.find();
        },
    },
    Mutation: {
        async signup(_, { username, email, password }) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                throw new Error("Email already in use");
            }

            const user = new User({ username, email, password });
            await user.save();

            const token = jwt.sign(
                { id: user._id, username, email },
                JWT_SECRET,
                { expiresIn: "1h" }
            );

            return { token, user };
        },
        async login(_, { email, password }) {
            const user = await User.findOne({ email });
            if (!user) {
                throw new AuthenticationError("User not found");
            }

            const isValidPassword = await bcrypt.compare(
                password,
                user.password
            );
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
        async addTransaction(_, { input }, context) {
            if (!context.user) {
                throw new AuthenticationError("Not authenticated");
            }

            const { type, amount, category, date, description } = input;
            let categoryDoc = await Category.findOne({ name: category });

            if (!categoryDoc) {
                categoryDoc = await Category.create({
                    name: category,
                    type: type.toLowerCase(),
                });
            }

            const transaction = await Transaction.create({
                userId: context.user.id,
                type,
                amount,
                category: categoryDoc._id,
                date,
                description,
            });

            return transaction.populate("category");
        },
        async deleteTransaction(_, { id }, context) {
            if (!context.user) {
                throw new AuthenticationError("Not authenticated");
            }

            const transaction = await Transaction.findById(id);
            if (!transaction) {
                throw new Error("Transaction not found");
            }

            // Ensure the transaction belongs to the logged-in user
            if (transaction.userId.toString() !== context.user.id) {
                throw new AuthenticationError(
                    "Unauthorized to delete this transaction"
                );
            }

            await transaction.remove();

            return transaction;
        },
    },
};

module.exports = resolvers;
