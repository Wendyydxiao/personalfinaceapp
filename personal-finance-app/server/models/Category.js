const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    type: {
        type: String,
        enum: ["income", "expense"],
        required: true,
    },
    description: {
        type: String,
        trim: true,
    },
});

module.exports = mongoose.model("Category", categorySchema);
