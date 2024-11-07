const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [/.+@.+\..+/, "Must match an email address!"],
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    },
    // Relationships
    transactions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Transaction",
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Pre-save middleware to hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// Method to compare passwords during login
userSchema.methods.isCorrectPassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
