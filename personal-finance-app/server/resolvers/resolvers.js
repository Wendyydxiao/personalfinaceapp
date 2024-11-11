const Transaction = require("../models/Transaction");
const Category = require("../models/Category");
const { AuthenticationError } = require("apollo-server-express");

const resolvers = {
    Query: {
        async getUser(_, __, context) {
            if (!context.user)
                throw new AuthenticationError("Not authenticated");
            return User.findById(context.user.id).populate({
                path: "transactions",
                populate: { path: "category" },
            });
        },
        async getTransactions(_, __, context) {
            if (!context.user)
                throw new AuthenticationError("Not authenticated");
            return Transaction.find({ userId: context.user.id }).populate(
                "category"
            );
        },
        async getCategories(_, __, context) {
            if (!context.user)
                throw new AuthenticationError("Not authenticated");
            return Category.find();
        },
    },
    Mutation: {
        async addTransaction(_, { input }, context) {
            if (!context.user)
                throw new AuthenticationError("Not authenticated");

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
            if (!context.user)
                throw new AuthenticationError("Not authenticated");
            return Transaction.findByIdAndDelete(id);
        },
    },
};

module.exports = resolvers;
