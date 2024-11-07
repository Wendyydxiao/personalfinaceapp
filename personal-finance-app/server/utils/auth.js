const jwt = require("jsonwebtoken");

// Define the secret and expiration for the JWT
const secret = process.env.JWT_SECRET || "your_jwt_secret_key";
const expiration = "1h";

// Function to sign a token for a user
function signToken({ _id, username, email }) {
    const payload = {
        id: _id,
        username,
        email,
    };
    return jwt.sign(payload, secret, { expiresIn: expiration });
}

// Middleware function to verify the token and add user data to the request context
function authMiddleware({ req }) {
    let token =
        req.headers.authorization || req.query.token || req.cookies.token;

    if (token && token.startsWith("Bearer ")) {
        token = token.slice(7, token.length).trim();
    }

    if (!token) {
        return req; // No token provided
    }

    try {
        const decoded = jwt.verify(token, secret);
        req.user = decoded; // Attach the decoded user data to req.user
    } catch (err) {
        console.error("Invalid token:", err);
        // Optionally, you could modify this to return an error
    }

    return req;
}

// New function to verify a token and return the decoded data
function verifyToken(token) {
    try {
        return jwt.verify(token, secret); // Will return the decoded token if valid
    } catch (err) {
        console.error("Token verification failed:", err);
        return null; // Return null if verification fails
    }
}

module.exports = { signToken, authMiddleware, verifyToken };
