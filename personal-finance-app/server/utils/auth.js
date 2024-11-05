// server/utils/auth.js

const jwt = require("jsonwebtoken");

// Define the secret and expiration for the JWT
const secret = process.env.JWT_SECRET || "mysecretsshhhhh";
const expiration = "1h";

// Function to sign a token for a user
function signToken(user) {
    const payload = {
        _id: user._id,
        username: user.username,
        email: user.email,
    };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
}

// Function to verify the token and return the user data
function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, secret);
        return decoded.data; // Return the user data
    } catch (err) {
        console.log("Invalid token");
        return null;
    }
}

module.exports = { signToken, verifyToken };
