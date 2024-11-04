// seed.js
const mongoose = require("mongoose");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const Category = require("../models/Category");
require("dotenv").config();

// MongoDB connection URI (use a test database to avoid affecting production data)
const MONGODB_URI =
    process.env.MONGODB_URI || "mongodb://localhost:27017/financeTracker";

// Connect to MongoDB
mongoose
    .connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(async () => {
        console.log("MongoDB connected");

        // Clear existing data in each collection
        await User.deleteMany({});
        await Transaction.deleteMany({});
        await Category.deleteMany({});

        // Seed Categories
        const incomeCategory = new Category({
            name: "Salary",
            type: "income",
            description: "Monthly salary",
        });
        const expenseCategory = new Category({
            name: "Groceries",
            type: "expense",
            description: "Weekly grocery shopping",
        });
        await incomeCategory.save();
        await expenseCategory.save();

        // Seed User
        const user = new User({
            username: "testuser",
            email: "testuser@example.com",
            password: "password123", // Ideally, hash the password if you plan to test authentication
            createdAt: new Date(),
        });
        await user.save();

        // Seed Transactions
        const incomeTransaction = new Transaction({
            userId: user._id,
            type: "income",
            amount: 3000.0,
            category: incomeCategory._id,
            date: new Date(),
            description: "August salary",
        });

        const expenseTransaction = new Transaction({
            userId: user._id,
            type: "expense",
            amount: 150.0,
            category: expenseCategory._id,
            date: new Date(),
            description: "Weekly groceries",
        });

        await incomeTransaction.save();
        await expenseTransaction.save();

        // Link transactions to user
        user.transactions.push(incomeTransaction._id, expenseTransaction._id);
        await user.save();

        console.log("Data seeded successfully");
        mongoose.connection.close();
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });
