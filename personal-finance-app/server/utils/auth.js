const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET || "abc123";
const expiration = "1h";

function verifyToken(token) {
    try {
        return jwt.verify(token, secret);
    } catch (err) {
        console.error("Token verification failed:", err.message);
        return null;
    }
}

function authMiddleware({ req }) {
    let token = req.headers.authorization || "";

    if (token.startsWith("Bearer ")) {
        token = token.slice(7).trim();
    }

    if (!token) {
        console.warn("No token provided");
        return req; // Pass the request unchanged if no token
    }

    const user = verifyToken(token);
    if (user) {
        req.user = user; // Attach the user to the request if verified
    } else {
        console.warn("Invalid or expired token");
    }

    return req;
}

module.exports = { verifyToken, authMiddleware };
