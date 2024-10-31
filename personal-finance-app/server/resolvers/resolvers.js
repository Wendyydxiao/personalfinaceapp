const User = require("./models/User");
const Transaction = require("./models/Transaction");
const Category = require("./models/Category");
const { AuthenticationError } = require("apollo-server-express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const resolvers = {
    Query: {
        async getUser(_, { id }) {
            try {
                return await User.findById(id).populate("transactions");
            } catch (err) {
                throw new Error("User not found");
            }
        },
        async getTransactions(_, { userId }) {
            try {
                return await Transaction.find({ userId }).populate("category");
            } catch (err) {
                throw new Error("Unable to fetch transactions");
            }
        },
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
        // User Registration
        async register(_, { username, email, password }) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                throw new Error("Email already in use");
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await User.create({
                username,
                email,
                password: hashedPassword,
                createdAt: new Date().toISOString(),
            });
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: "1h",
            });
            return { token, user };
        },

        // User Login
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
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: "1h",
            });
            return { token, user };
        },

        // Add Transaction
        async addTransaction(
            _,
            { userId, type, amount, category, date, description }
        ) {
            try {
                const transaction = new Transaction({
                    userId,
                    type,
                    amount,
                    category,
                    date,
                    description,
                });
                await transaction.save();

                // Link transaction to user
                await User.findByIdAndUpdate(userId, {
                    $push: { transactions: transaction._id },
                });

                return transaction.populate("category");
            } catch (err) {
                throw new Error("Unable to add transaction");
            }
        },

        // Update Transaction
        async updateTransaction(
            _,
            { id, type, amount, categoryId, date, description }
        ) {
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
                throw new Error("Unable to update transaction");
            }
        },

        // Delete Transaction
        async deleteTransaction(_, { id }) {
            try {
                const transaction = await Transaction.findByIdAndDelete(id);
                if (!transaction) throw new Error("Transaction not found");

                // Remove reference from user
                await User.findByIdAndUpdate(transaction.userId, {
                    $pull: { transactions: id },
                });
                return transaction;
            } catch (err) {
                throw new Error("Unable to delete transaction");
            }
        },

        // Add Category
        async addCategory(_, { name, type, description }) {
            try {
                const category = new Category({
                    name,
                    type,
                    description,
                });
                await category.save();
                return category;
            } catch (err) {
                throw new Error("Unable to add category");
            }
        },

        // Delete Category
        async deleteCategory(_, { id }) {
            try {
                const category = await Category.findByIdAndDelete(id);
                if (!category) throw new Error("Category not found");
                return category;
            } catch (err) {
                throw new Error("Unable to delete category");
            }
        },
    },
};

module.exports = resolvers;
