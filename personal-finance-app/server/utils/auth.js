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
        console.error("No token provided");
        return req;
    }

    const user = verifyToken(token);
    if (user) {
        req.user = user;
    } else {
        console.error("Invalid token");
    }

    return req;
}

module.exports = { verifyToken, authMiddleware };
